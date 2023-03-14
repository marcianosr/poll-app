import { FC, useState } from "react";
import { useLoaderData } from "react-router";
import { LoaderData } from "~/routes/polls/$id";
import { JSEgg } from "~/seasonal/Egg/EggContainer";
import { Banner } from "~/ui/Banner";
import { ProfileCard, ProfileCardContainer } from "~/ui/ProfileCard";
import { Title } from "~/ui/Title";
import { Button } from "../../ui/Button";

type Props = {
	users: any;
};

type Statistics = "all-time" | "correct" | "season";

const UsersPollRankingContainer: FC<Props> = ({ users }) => {
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
			<PollRankingsContainer active={active} users={users} />
		</section>
	);
};

export default UsersPollRankingContainer;

type PollRankingsContainer = {
	active: Statistics;
	users: any;
};

const PollRankingsContainer = ({ active, users }: PollRankingsContainer) => (
	<section className="poll-rankings">
		{active === "all-time" && <AllTimeTotalPolls users={users} />}
		{active === "correct" && <CorrectPolls users={users} />}
		{active === "season" && (
			<Banner variant="warning" size="wide" icon="🏗️👷🏻‍♂️">
				<Title variant="primary" size="xl" tag="span">
					Coming soon!
				</Title>
			</Banner>
		)}
	</section>
);

const AllTimeTotalPolls = ({ users }: any) => {
	const { poll } = useLoaderData() as LoaderData;

	return (
		<>
			{users
				.filter((user: any) => user.polls.total > 7)
				.sort((a: any, b: any) => b.polls.total - a.polls.total)
				.map((user: any) => (
					<ProfileCardContainer
						user={user}
						users={users}
						variant="total"
					>
						<ProfileCard user={user} points={user.polls.total} />
					</ProfileCardContainer>
				))}
			{poll.category === "javascript" && <FakeProfileCard />}
		</>
	);
};

const FakeProfileCard = () => {
	const [revealEgg, setRevealEgg] = useState(false);

	return (
		<div onClick={setRevealEgg} style={{ position: "relative" }}>
			<ProfileCardContainer
				user={{
					photoURL:
						"https://lh3.googleusercontent.com/a-/AFdZucoFC4VtREWmLxZMPXnw8X6UriZAEnz77n0GTCAM=s96-c",
				}}
				users={[]}
				variant="total"
			>
				<ProfileCard
					user={{
						displayName: "CSEGGS Challenges",
						photoURL:
							"https://lh3.googleusercontent.com/a-/AFdZucoFC4VtREWmLxZMPXnw8X6UriZAEnz77n0GTCAM=s96-c",
					}}
					points={100}
				/>
				{revealEgg && (
					<div
						style={{
							position: "absolute",
							left: "-100%",
							top: "100px",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<JSEgg id="2" size="lg" />
					</div>
				)}
			</ProfileCardContainer>
		</div>
	);
};

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
