import classnames from "classnames";
import { FC, useState } from "react";
import { Banner } from "~/ui/Banner";
import { Title } from "~/ui/Title";
import { Button } from "../../ui/Button";

type Props = {
	users: any;
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

const UserStatistics: FC<Props> = ({ users }) => {
	const [active, setActive] = useState<Statistics>("all-time");

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
					<Banner variant="warning" size="wide" icon="🏗️👷🏻‍♂️">
						<Title variant="primary" size="xl" tag="span">
							Coming soon!
						</Title>
					</Banner>
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
