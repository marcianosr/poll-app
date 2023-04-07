import { FC, useState } from "react";
import { ProfileCard, ProfileCardContainer } from "~/ui/ProfileCard";
import { Button } from "../../ui/Button";

type Props = {
	users: any;
};

type Statistics = "all-time" | "correct" | "season";

const UsersPollRankingContainer: FC<Props> = ({ users }) => {
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
			<PollRankingsContainer active={active} users={users} />
		</section>
	);
};

export default UsersPollRankingContainer;

type PollRankingsContainer = {
	active: Statistics;
	users: any;
};

const PollRankingsContainer = ({ active, users }: PollRankingsContainer) => {
	return (
		<section className="poll-rankings">
			{active === "all-time" && <AllTimeTotalPolls users={users} />}
			{active === "correct" && <CorrectPolls users={users} />}
			{active === "season" && <h1>Brewing something new... 🧪🧑‍🔬</h1>}
		</section>
	);
};
const AllTimeTotalPolls = ({ users }: any) => (
	<>
		{users
			.filter((user: any) => user.polls.total > 7)
			.sort((a: any, b: any) => b.polls.total - a.polls.total)
			.map((user: any) => (
				<ProfileCardContainer user={user} users={users} variant="total">
					<ProfileCard user={user} points={user.polls.total} />
				</ProfileCardContainer>
			))}
	</>
);

const CorrectPolls = ({ users }: any) => (
	<>
		{users
			.filter((user: any) => user.polls.total > 7)
			.sort((a: any, b: any) => b.polls.correct - a.polls.correct)
			.map((user: any) => (
				<ProfileCardContainer user={user} users={users} variant="total">
					<ProfileCard user={user} points={user.polls.correct} />
				</ProfileCardContainer>
			))}
	</>
);
