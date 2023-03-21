import classNames from "classnames";
import { FC, useState } from "react";
import { useLoaderData } from "react-router";
import { useAuth } from "~/providers/AuthProvider";
import { LoaderData } from "~/routes/polls/$id";
import { Egg } from "~/seasonal/Egg";
import { EggConditional } from "~/seasonal/Egg/EggContainer";
import { ProfileCard, ProfileCardContainer } from "~/ui/ProfileCard";
import { Button } from "../../ui/Button";
import { Text } from "../../ui/Text";

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

const countsByUserAndColor = (data) =>
	data.reduce((acc, curr) => {
		const userId = curr.userId;
		const eggs = curr.eggs;
		for (const egg of eggs) {
			const eggParts = egg.split("-");
			const color = eggParts[1];
			if (!acc[userId]) {
				acc[userId] = {};
			}
			if (!acc[userId][color]) {
				acc[userId][color] = 0;
			}
			acc[userId][color]++;
		}
		return acc;
	}, {});

const countTotalEggsByUser = (data) => {
	const counts = countsByUserAndColor(data);
	return Object.keys(counts).reduce((acc, curr) => {
		acc[curr] = Object.values(counts[curr]).reduce(
			(acc, curr) => acc + curr,
			0
		);
		return acc;
	}, {});
};

const PollRankingsContainer = ({ active, users }: PollRankingsContainer) => {
	const { easter } = useLoaderData() as LoaderData;
	const totalEggs = countTotalEggsByUser(easter);

	return (
		<section className="poll-rankings">
			{active === "all-time" && <AllTimeTotalPolls users={users} />}
			{active === "correct" && <CorrectPolls users={users} />}
			{active === "season" && (
				<SeasonalPolls users={users} totalEggs={totalEggs} />
			)}
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
		<FakeProfileCard />
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

const SeasonalPolls = ({ users, totalEggs }: any) => {
	const { easter } = useLoaderData() as LoaderData;
	const { user: authUser } = useAuth();
	const scores = countsByUserAndColor(easter);
	return (
		<ul className="easter-ranking-list">
			{users
				.filter((user: any) => user.polls.total > 7)
				.sort(
					(a: any, b: any) =>
						b.polls.seasonStreak - a.polls.seasonStreak
				)
				.map((user: any, idx: number) => (
					<li
						className={classNames("easter-ranking-list-item", {
							"is-current-user":
								user.id === authUser?.firebase.id,
						})}
					>
						<div className="easter-ranking-list-item-inner">
							<div className="easter-place">
								<Text size="md" variant="primary">
									{idx + 1}
								</Text>
							</div>
							<div className="easter-name-container">
								<img
									className="easter-ranking-img"
									alt={user.displayName}
									src={user.photoURL}
								/>
								<Text size="sm" variant="secondary">
									{user.displayName}
								</Text>
							</div>
							<div className="user-eggs-container">
								<div className="user-eggs">
									<Egg variant={"red"} size={"sm"} />
									<Text size="sm" variant="secondary">
										{scores[user.id]?.red || 0} / 3
									</Text>
								</div>
								<div className="user-eggs">
									<Egg variant={"blue"} size={"sm"} />
									<Text size="sm" variant="secondary">
										{scores[user.id]?.blue || 0} / 5
									</Text>
								</div>
								<div className="user-eggs">
									<Egg variant={"yellow"} size={"sm"} />
									<Text size="sm" variant="secondary">
										{scores[user.id]?.yellow || 0} / 5
									</Text>
								</div>
							</div>
							<div className="easter-rank-scores">
								<Text size="xl" variant="secondary">
									{user.polls.seasonStreak}
								</Text>
								<Text size="sm" variant="secondary">
									(+{totalEggs[user.id] || 0})
								</Text>
							</div>
						</div>
					</li>
				))}
		</ul>
	);
};

const FakeProfileCard = () => {
	const [revealEgg, setRevealEgg] = useState(false);
	const { poll } = useLoaderData() as LoaderData;

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
						<EggConditional
							{...(poll.category === "javascript" && {
								category: "js",
							})}
							id="1"
							size="lg"
						/>
					</div>
				)}
			</ProfileCardContainer>
		</div>
	);
};
