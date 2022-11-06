import classnames from "classnames";
import { FC, useState } from "react";

type Props = {
	users: any;
};

type Statistics = "all-time" | "correct" | "season";

const UserStatistics: FC<Props> = ({ users }) => {
	const [active, setActive] = useState<Statistics>("all-time");

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
					Highest season total
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
								<article className="profile-container">
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
								<article className="profile-container">
									<UserLayout user={user} />
									<div className="skewed-container">
										<span>{user.polls.correct}</span>
									</div>
								</article>
							))}
					</>
				)}
				{active === "season" && (
					<>
						{users
							.filter((user) => user.polls.total > 7)
							.sort(
								(a, b) =>
									b.polls.seasonStreak - a.polls.seasonStreak
							)
							.map((user) => (
								<article className="profile-container">
									<UserLayout user={user} />
									<div className="skewed-container">
										<span>{user.polls.seasonStreak}</span>
									</div>
								</article>
							))}
					</>
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