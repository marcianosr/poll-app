import { Fragment, useEffect, useState } from "react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { Voted, PollData } from "~/utils/polls";
import {
	getPollById,
	updatePollById,
	getPollsByOpeningTime,
	getAmountOfClosedPolls,
	getAllPolls,
} from "~/utils/polls";
import type { FirebaseUserFields } from "~/providers/AuthProvider";
import { useAuth } from "~/providers/AuthProvider";
import {
	PollStatusInfo,
	links as pollStatusLinks,
} from "~/components/PollStatusInfo";
import { getUserByID, getUsers, updateUserById } from "~/utils/user";
import type { DeepPartial } from "~/utils/types";
import styles from "~/styles/poll.css";
import classNames from "classnames";
import { links as awardsBoardLinks, Ranks } from "~/components/Awards";
import { Question, links as questionLinks } from "~/components/Question";
import { CodeBlock, links as codeBlockLinks } from "~/ui/CodeBlock";
import { links as buttonLinks } from "~/ui/Button";
import { getAllSeasons } from "~/utils/seasons";
import type { SeasonAwardData } from "~/utils/seasons";
import { SentByUserText } from "~/components/SentByUserText";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import UserStatistics from "~/components/UserStatistics";
import { colors } from "~/utils/colors";
import { ResultsScreen } from "~/components/ResultsScreen";
import { links as pollScreenLinks, PollScreen } from "~/components/PollScreen";
import { getTeams, Team, UpdateTeam, updateTeamById } from "~/utils/teams";
import { yourVoteStyles } from "../../../compositions/YourVotes";
import { resultsListStyles } from "../../../compositions/ResultsList";
import { Title } from "../../../ui/Title";
import { EekumBokum } from "~/components/EekumBokum";
import { AwardsContainer } from "~/components/Awards/Container";

export type ScreenState = "poll" | "results";

export type UpdateScore = Omit<DeepPartial<FirebaseUserFields>, "role">;

export function links() {
	return [
		...yourVoteStyles(),
		...resultsListStyles(),
		...buttonLinks(),

		...codeBlockLinks(),
		...awardsBoardLinks(),
		...pollStatusLinks(),
		...questionLinks(),
		...pollScreenLinks(),
		{ rel: "stylesheet", href: styles },
	];
}

const findCurrentStreakLength = (streak: boolean[]) => {
	for (let i = 0; i < streak.length; i++) {
		if (!streak[i]) return i;
	}

	return streak.length;
};

export const action: ActionFunction = async ({ request, params }) => {
	const formData = await request.formData();
	const selectedVotes = formData.get("selectedVotes") as string;
	const uid = formData.get("uid") as string;
	const paramId = params.id || "";
	const parsedVoted = JSON.parse(selectedVotes) as Voted[];

	const polls = (await getPollById(paramId)) as PollData;

	const hasAlreadyVoted = polls.voted.find((voted) => voted.userId === uid);

	if (hasAlreadyVoted) {
		return {
			error: "has-voted",
			message: "User has already voted",
		};
	}

	// const getAmountOfCorrectAnswers = polls.correctAnswers.filter((answer) =>
	// 	parsedVoted.find((voted) => answer.id === voted.answerId)
	// ).length;

	const isEveryAnswerCorrect = parsedVoted
		.map((voted) =>
			polls.correctAnswers.find((answer) => answer.id === voted.answerId)
		)
		.every((answer) => answer);

	await updatePollById(paramId, {
		voted: [...polls.voted, ...parsedVoted],
	});

	const currentUser = await getUserByID(uid);
	const pollsStartedByDate = await getPollsByOpeningTime();

	const getVotedPollsByUser = pollsStartedByDate
		.map((poll) =>
			poll.voted
				.filter((vote: Voted) => vote.userId === uid)
				.map((vote: Voted) => vote.userId)
				.filter(
					(userId: string, index: number, array: string[]) =>
						array.indexOf(userId) === index
				)
				.some((userIds: string[]) => userIds.length > 0)
		)
		.slice()
		.reverse();

	// current voter
	await updateUserById<UpdateScore>({
		id: uid,
		polls: {
			answeredById: [...currentUser?.polls.answeredById, paramId],
			total: currentUser?.polls.total + 1,
			seasonStreak:
				1 + (currentUser?.polls.seasonStreak + polls.voted.length),

			currentStreak: findCurrentStreakLength(getVotedPollsByUser),
			correct: isEveryAnswerCorrect
				? currentUser?.polls.correct + 1
				: currentUser?.polls.correct,
		},
		lastPollSubmit: Date.now(),
	});

	const teams = await getTeams();

	const team = teams.find((team) =>
		team.users.find((tuid: string) => tuid === uid)
	);

	if (team) {
		const amountOfUsersVotedByTeam =
			team?.users.filter((tuid: string) =>
				polls.voted.find((vote: Voted) => {
					return vote.userId === tuid;
				})
			).length + 1;

		const pointsPerAmountOfTeamVotes = 2 ** amountOfUsersVotedByTeam;

		// find user by team id
		// update points: get prev. team points + sum of length of teams
		await updateTeamById<UpdateTeam>({
			id: team?.id || "",
			points: {
				streak:
					amountOfUsersVotedByTeam === team.users.length
						? team.points.streak + 1
						: team.points.streak,
				total: team.points.total + pointsPerAmountOfTeamVotes,
			},
		});
	}

	const getUserIdsByVote = parsedVoted.map((votes) => votes.userId).flat();
	const hasVoted = getUserIdsByVote.includes(uid);

	return {
		error: !hasVoted,
	};
};

export type LoaderData = {
	poll: PollData;
	polls: PollData[];
	responses: number;
	users: any; // !TODO: type this
	openedPollNumber: number;
	seasons: SeasonAwardData[];
	teams: Team[];
};

export const loader: LoaderFunction = async ({ params }) => {
	const data = await getPollById(params.id || "");
	const polls = await getAllPolls();
	const users = await getUsers();
	const teams = await getTeams();
	const amountOfClosedPolls = await getAmountOfClosedPolls();
	const seasons = await getAllSeasons();
	const openedPollNumber = amountOfClosedPolls + 1; // ! Closed polls + current open poll

	const getUserIdsByVote = data?.voted
		.map((votes: Voted) => votes.userId)
		.flat();

	const responses = new Set([...getUserIdsByVote]).size;

	return {
		poll: data,
		responses,
		users,
		openedPollNumber,
		polls,
		seasons,
		teams,
	};
};

export const transformToCodeTags = (value: string, idx?: number) => {
	const code = value.split(" ").join(" ");

	if (code.startsWith("```")) {
		const value = code.split("```");
		return <pre key={idx}>{value}</pre>;
	}

	const words = value.split(" ");

	const wrapWords = words.map((word, idx) => {
		if (word.startsWith("`")) {
			return <code key={idx}>{word.split("`")[1]} </code>;
		}

		return <Fragment key={idx}>{word + " "}</Fragment>;
	});

	return wrapWords;
};

export default function PollDetail() {
	const { poll, users, openedPollNumber, polls, seasons, teams } =
		useLoaderData() as LoaderData;
	const { user, isAdmin } = useAuth();

	const [screenState, setScreenState] = useState<ScreenState>("poll");
	const [showVotedBy, setShowVotedBy] = useState(false);

	const [currentAnswers, setCurrentAnswers] = useState(poll.answers);
	const { width, height } = useWindowSize();

	// Can't check this server-side unless uid is stored somewhere in a cookie or something
	const userHasVoted = poll.voted.find(
		(voted) => voted.userId === user?.firebase.id
	);

	useEffect(() => {
		if (userHasVoted) setScreenState("results");
	}, [user?.firebase.id, userHasVoted]);

	//! Re-check this fn
	// const isDefaultChecked = (answer: Answer) => {
	// 	const findVotedAnswer = poll.voted
	// 		.filter((voted) => voted.answerId === answer.id)
	// 		.filter((voted) => voted.userId === user?.firebase.id);

	// 	console.log("find answer", findVotedAnswer);
	// 	return findVotedAnswer.length > 0;
	// };

	const getCorrectAnswers = (answerId: string) =>
		!!poll.correctAnswers.find((correct) => correct.id === answerId);

	// ? For future: it would be cool if these functions happen on the server because they can be quite expensive on the frontend. UID on the server is needed
	const getVotesFromAllUsers = (answerId: string) => {
		return (
			poll.voted
				.filter((vote) => vote.answerId === answerId)
				.map((vote) => vote.userId)
				// ! improve
				.map((id) => users.find((user) => user.id === id))
		);
	};

	return (
		<section
			className={classNames("page-container", {
				[poll.category]: true,
			})}
		>
			{openedPollNumber === 100 && typeof window !== "undefined" && (
				<Confetti width={width} height={height} colors={colors} />
			)}
			<aside className="sidebar-info">
				<PollStatusInfo
					status={poll.status}
					openedPollNumber={openedPollNumber}
					pollNumber={poll.pollNumber || 0}
				/>
				<EekumBokum
					showVotedBy={showVotedBy}
					setShowVotedBy={setShowVotedBy}
					setScreenState={setScreenState}
					isAdmin={isAdmin}
				/>
				<section className="ranks">
					<h2 className="title">Ranks</h2>
					<Ranks users={users} polls={polls} />
				</section>
			</aside>
			<section className="main-content">
				{isAdmin && <Link to="/polls">Back to list of polls</Link>}

				<Question title={poll.question} />
				{poll.sentInByUser && (
					<SentByUserText name={poll.sentInByUser?.displayName} />
				)}
				{poll.codeSandboxExample && (
					<iframe
						width="100%"
						height="500"
						src={poll.codeSandboxExample}
					/>
				)}
				{poll.codeBlock && (
					<>
						<Title size="md" variant="primary" tag="span">
							Code example
						</Title>
						<CodeBlock code={poll.codeBlock} />
					</>
				)}
				{screenState === "poll" && (
					<PollScreen
						getCorrectAnswers={getCorrectAnswers}
						showVotedBy={showVotedBy}
						getVotesFromAllUsers={getVotesFromAllUsers}
						currentAnswers={currentAnswers}
					/>
				)}
				{screenState === "results" && (
					<ResultsScreen
						getCorrectAnswers={getCorrectAnswers}
						currentAnswers={currentAnswers}
						getVotesFromAllUsers={getVotesFromAllUsers}
					/>
				)}

				<UserStatistics
					users={users}
					voted={poll.voted}
					teams={teams}
				/>

				<AwardsContainer
					users={users}
					polls={polls}
					seasons={seasons}
				/>
			</section>
		</section>
	);
}
