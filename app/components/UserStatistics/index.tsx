import classnames from "classnames";
import { FC, Fragment, useState } from "react";
import { Voted } from "~/utils/polls";
import { Team } from "~/utils/teams";
import { Button } from "../../ui/Button";

type Props = {
	users: any;
	voted: any;
	teams: Team[];
};

type Statistics = "all-time" | "correct" | "season";

const getWinner = (users: any, field: "seasonStreak" | "total" | "correct") => {
	const winner = users
		.filter((a) => a.polls[field])
		.reduce(
			(max, obj) => {
				return max.polls[field] > obj.polls[field] ? max : obj;
			},
			{ polls: { [field]: 0 } }
		);

	const hasWinners = Object.values(winner);
	const winners = hasWinners.length
		? users.filter(
				(user: any) =>
					user.polls[field] === winner.polls[field] &&
					user.polls[field] !== 0
		  )
		: [];

	return winners;
};

const UserStatistics: FC<Props> = ({ users, voted, teams }) => {
	const [active, setActive] = useState<Statistics>("season");

	return (
		<section className="poll-statistics-container">
			<h2 className="title">Statistics</h2>
			<section className="filters">
				<Button
					variant="secondary"
					onClick={() => setActive("all-time")}
					state={(active === "all-time" && "active") || undefined}
				>
					All-time highest total
				</Button>
				<Button
					variant="secondary"
					onClick={() => setActive("season")}
					state={(active === "season" && "active") || undefined}
				>
					Highest total this season
				</Button>
				<Button
					variant="secondary"
					onClick={() => setActive("correct")}
					state={(active === "correct" && "active") || undefined}
				>
					All-time highest correct total
				</Button>
			</section>
			<section className="poll-statistics">
				{active === "all-time" && (
					<>
						{users
							.filter((user) => user.polls.total > 7)
							.sort((a, b) => b.polls.total - a.polls.total)
							.map((user) => (
								<article
									key={user.id}
									className={classnames("profile-container", {
										winner: getWinner(users, "total").find(
											(u) => u.email === user.email
										),
									})}
								>
									<UserLayout user={user} />
									<div className="skewed-container">
										<span>{user.polls.total}</span>
									</div>
								</article>
							))}
					</>
				)}
				{active === "correct" && (
					<>
						{users
							.filter((user) => user.polls.total > 7)
							.sort((a, b) => b.polls.correct - a.polls.correct)
							.map((user) => (
								<article
									key={user.id}
									className={classnames("profile-container", {
										winner: getWinner(
											users,
											"correct"
										).find((u) => u.email === user.email),
									})}
								>
									<UserLayout user={user} />
									<div className="skewed-container">
										<span>{user.polls.correct}</span>
									</div>
								</article>
							))}
					</>
				)}
				{active === "season" && (
					<section className="team-season-container">
						<h1 className="team-season-title">Teams leaderboard</h1>
						<ol className="team-list">
							{teams
								.sort((a, b) => b.points.total - a.points.total)
								.map((team, idx) => {
									const votedUserIds = voted.map(
										(vote: Voted) => vote.userId
									);

									const votedUserIdsByTeam =
										votedUserIds.filter((id: string) =>
											team.users.find(
												(tuid) => tuid === id
											)
										);

									return (
										<Fragment key={team.name}>
											<li
												className={classnames(
													"team-container",
													team.name.toLowerCase()
												)}
											>
												<section className="team-list-item skew-item">
													<div className="team-name">
														<span className="team-place">
															{idx + 1}
														</span>
														<span className="team-text">
															Team
														</span>
														<h3>{team.name}</h3>
													</div>
													<ul className="team-list-photos">
														{users
															.filter((user) =>
																team.users.find(
																	(uid) =>
																		uid ===
																		user.id
																)
															)
															.map((user) => {
																const userHasVoted =
																	voted.find(
																		(
																			vote: Voted
																		) =>
																			vote.userId ===
																			user.id
																	);

																const index =
																	votedUserIdsByTeam.findIndex(
																		(
																			id: string
																		) =>
																			id ===
																			user.id
																	) + 1;

																return (
																	<li
																		key={
																			user.displayName
																		}
																		className="team-list-items-photos"
																	>
																		{index ===
																		0 ? (
																			<div className="team-addition">
																				0
																			</div>
																		) : (
																			<div className="team-addition">
																				+
																				{2 **
																					index}
																			</div>
																		)}

																		<img
																			src={
																				user.photoURL
																			}
																			width="85"
																			height="85"
																		/>
																	</li>
																);
															})}
													</ul>
												</section>
												<div className="skew-item team-points-container">
													<span className="team-title-text">
														streak
													</span>
													<div>
														{team.points.streak}
													</div>
												</div>
												<div className="skew-item team-points-container">
													<span className="team-title-text">
														total
													</span>
													<div>
														{team.points.total}
													</div>
												</div>
											</li>
										</Fragment>
									);
								})}
						</ol>
					</section>
				)}
			</section>
		</section>
	);
};

export default UserStatistics;

type UserLayoutProps = { user: any };

const UserLayout: FC<UserLayoutProps> = ({ user }) => (
	<>
		<div className="skewed-container name-container">
			<span className="first-name">{user.displayName.split(" ")[0]}</span>
			<span className="last-name">
				{user.displayName.split(" ")[1]}{" "}
				{user.displayName.split(" ")[2]}
			</span>
		</div>
		<div className="user-profile-img-container">
			<img
				className="user-profile-img"
				src={user.photoURL.split("s96-c")[0] + "s300-c"}
			/>
		</div>
	</>
);
