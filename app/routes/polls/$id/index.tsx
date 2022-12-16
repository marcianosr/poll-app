import React, { Fragment, useEffect, useState } from "react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
	Form,
	Link,
	useActionData,
	useLoaderData,
	useTransition,
} from "@remix-run/react";
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
import {
	Awards,
	links as awardsBoardLinks,
	Ranks,
	UpcomingAwards,
} from "~/components/Awards";
import { Question, links as questionLinks } from "~/components/Question";
import PollStatistics from "~/components/PollStatistics";
import { CodeBlock, links as codeBlockLinks } from "~/components/CodeBlock";
import { links as adventCalendarLinks } from "~/components/AdventCalendar";
import { getAllSeasons } from "~/utils/seasons";
import type { SeasonAwardData } from "~/utils/seasons";
import { SentByUserText } from "~/components/SentByUserText";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import UserStatistics from "~/components/UserStatistics";
import { colors } from "~/utils/colors";
import {
	links as noticeBannerLinks,
	NoticeBanner,
} from "~/components/NoticeBanner";
import { ResultsScreen } from "~/components/ResultsScreen";
import { links as pollScreenLinks, PollScreen } from "~/components/PollScreen";

type ScreenState = "poll" | "results";

export type UpdateScore = Omit<DeepPartial<FirebaseUserFields>, "role">;

export function links() {
	return [
		...adventCalendarLinks(),
		...codeBlockLinks(),
		...awardsBoardLinks(),
		...pollStatusLinks(),
		...questionLinks(),
		...noticeBannerLinks(),
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

	// on each vote, update players who have already voted with one point because a new user voted
	polls.voted.map(async (vote) => {
		const user = await getUserByID(vote.userId);

		await updateUserById<UpdateScore>({
			id: vote.userId,
			polls: {
				seasonStreak: user?.polls.seasonStreak + 1,
			},
		});
	});

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
};

export const loader: LoaderFunction = async ({ params }) => {
	const data = await getPollById(params.id || "");
	const polls = await getAllPolls();
	const users = await getUsers();
	const amountOfClosedPolls = await getAmountOfClosedPolls();
	const seasons = await getAllSeasons();
	const openedPollNumber = amountOfClosedPolls + 1; // ! Closed polls + current open poll

	const getUserIdsByVote = data?.voted
		.map((votes: Voted) => votes.userId)
		.flat();

	const responses = new Set([...getUserIdsByVote]).size;

	return { poll: data, responses, users, openedPollNumber, polls, seasons };
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
	const { poll, users, openedPollNumber, polls, seasons } =
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

	const getVotersFromToday = poll.voted
		.map((vote) => ({
			...users.find((user) => user.id === vote.userId),
			vote,
		}))
		.map((user) => {
			const correctAnswer = getCorrectAnswers(user.vote.answerId);

			return (
				<li
					className={classNames("vote-order-list-item", {
						userCorrect: correctAnswer,
						userIncorrect: !correctAnswer,
					})}
				>
					<img src={user.photoURL} width={65} height={65} />
				</li>
			);
		});

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
				{isAdmin && (
					<section className="eekum-bokum-oomenacka">
						<span>Eekum Bokum Oomenacka!</span>
						<input
							type="checkbox"
							id="votedBy"
							onChange={() => setShowVotedBy(!showVotedBy)}
							name="votedBy"
						/>
						<input
							type="checkbox"
							id="screen"
							onChange={() => setScreenState("results")}
							name="screen"
						/>
					</section>
				)}
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
						<p>Code example:</p>
						<CodeBlock code={poll.codeBlock} />
					</>
				)}
				{screenState === "poll" && (
					<PollScreen
						showVotedBy={showVotedBy}
						getVotesFromAllUsers={getVotesFromAllUsers}
						currentAnswers={currentAnswers}
					/>
				)}
				{screenState === "results" && (
					<ResultsScreen
						getCorrectAnswers={getCorrectAnswers}
						currentAnswers={currentAnswers}
						showVotedBy={showVotedBy}
						getVotesFromAllUsers={getVotesFromAllUsers}
					/>
				)}

				<UserStatistics users={users} voted={poll.voted} />

				<section className="awards-container">
					<h2 className="title">Awards</h2>
					<Awards users={users} polls={polls} seasons={seasons} />
				</section>

				<section className="awards-container">
					<h2 className="title">Upcoming Awards</h2>
					<UpcomingAwards users={users} polls={polls} />
				</section>
				{/* <PollStatistics polls={polls} /> */}
			</section>
			{getVotersFromToday.length > 0 && (
				<aside className="vote-order-sidebar">
					<ol className="vote-order-container">
						<span className="vote-order-title">Today's voters</span>
						{getVotersFromToday}
					</ol>
				</aside>
			)}
		</section>
	);
}
