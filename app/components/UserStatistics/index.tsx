import classnames from "classnames";
import { FC, useState } from "react";
import { AdventCalendar } from "../AdventCalendar";

type Props = {
	users: any;
	voted: any;
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

const UserStatistics: FC<Props> = ({ users, voted }) => {
	const [active, setActive] = useState<Statistics>("season");

	return (
		<section className="poll-statistics-container">
			<h2 className="title">Statistics</h2>
			<section className="filters">
				<button
					className={classnames("filter-button", {
						active: active === "all-time",
					})}
					onClick={() => setActive("all-time")}
				>
					All-time highest total
				</button>
				<button
					className={classnames("filter-button", {
						active: active === "season",
					})}
					onClick={() => setActive("season")}
				>
					Highest total this season
				</button>
				<button
					className={classnames("filter-button", {
						active: active === "correct",
					})}
					onClick={() => setActive("correct")}
				>
					All-time highest correct total
				</button>
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
					<div className="season">
						<div className="advent-of-polls-text">
							<div className="advent-of-polls-text-container">
								<h1 className="advent-of-polls-title">
									Advent of polls
								</h1>
							</div>

							<div className="advent-of-polls-text-container">
								<p className="advent-of-polls-description">
									Bonus counter (increases when more people
									vote)
								</p>
								<p className="advent-of-polls-description">
									<strong className="advent-of-polls-bonus">
										+{voted.length}
									</strong>
								</p>
							</div>
						</div>
						<section className="advent-calendar">
							{users
								.filter((user) => user.polls.total > 7)
								.sort(
									(a, b) =>
										b.polls.seasonStreak -
										a.polls.seasonStreak
								)
								.map((user: any, idx: number) => (
									// <article
									// 	key={user.id}
									// 	className={classnames("profile-container", {
									// 		winner: getWinner(
									// 			users,
									// 			"seasonStreak"
									// 		).find((u) => u.email === user.email),
									// 	})}
									// >
									// 	<UserLayout user={user} />
									// 	<div className="skewed-container">
									// 		<span>{user.polls.seasonStreak}</span>
									// 	</div>
									// </article>

									<AdventCalendar
										user={user}
										idx={idx + 1}
										voted={voted}
									/>
								))}
						</section>
					</div>
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
