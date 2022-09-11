import React, { Fragment, useEffect, useState } from "react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
	Form,
	Link,
	useActionData,
	useLoaderData,
	useParams,
} from "@remix-run/react";
import {
	Answer,
	Voted,
	getPollById,
	PollData,
	updatePollById,
} from "~/utils/polls";
import Countdown from "react-countdown";
import classNames from "classnames";
import { FirebaseUserFields, useAuth } from "~/providers/AuthProvider";
import PollStatus from "~/components/PollStatus";
import { getUserByID, getUsers, updateUserById } from "~/utils/user";
import { DeepPartial } from "~/utils/types";
import styles from "~/styles/poll.css";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
	collection,
	doc,
	getFirestore,
	setDoc,
	onSnapshot,
} from "firebase/firestore";
import { firebaseConfig } from "~/utils/config.client";
import useCountDown from "react-countdown-hook";

type ScreenState = "poll" | "results";

export type UpdateScore = Omit<DeepPartial<FirebaseUserFields>, "role">;

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const action: ActionFunction = async ({ request, params }) => {
	const formData = await request.formData();
	const selectedVotes = formData.get("selectedVotes") as string;
	const uid = formData.get("uid") as string;
	const paramId = params.id || "";
	const parsedVoted = JSON.parse(selectedVotes) as Voted[];

	const polls = (await getPollById(paramId)) as PollData;

	const getAmountOfCorrectAnswers = polls.correctAnswers.filter((answer) =>
		parsedVoted.find((voted) => answer.id === voted.answerId)
	).length;

	const isEveryAnswerCorrect = parsedVoted
		.map((voted) =>
			polls.correctAnswers.find((answer) => answer.id === voted.answerId)
		)
		.every((answer) => answer);

	await updatePollById(paramId, {
		voted: [...polls.voted, ...parsedVoted],
	});

	const currentUser = await getUserByID(uid);

	await updateUserById<UpdateScore>({
		id: uid,
		polls: {
			answeredById: [...currentUser?.polls.answeredById, paramId],
			total: currentUser?.polls.total + 1,
			currentStreak: currentUser?.polls.currentStreak + 1,
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

type LoaderData = {
	poll: PollData;
	responses: number;
	users: any; // !TODO: type this
	timer: number;
};

export const loader: LoaderFunction = async ({ params }) => {
	const data = await getPollById(params.id || "");
	const users = await getUsers();

	const eightHours = 0.1 * 60 * 60 * 1000;
	const timer = data?.openingTime + eightHours;

	const getUserIdsByVote = data?.voted
		.map((votes: Voted) => votes.userId)
		.flat();

	const responses = new Set([...getUserIdsByVote]).size;

	return { poll: data, responses, users, timer };
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

const closePoll = async (pollId: string) => {
	const app =
		getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

	const db = getFirestore(app);

	const ref = collection(db, "polls");

	await setDoc(
		doc(db, "polls", pollId),
		{ status: "closed" },
		{ merge: true }
	);
};

export default function PollDetail() {
	const { poll, responses, users, timer } = useLoaderData() as LoaderData;
	const { user, isAdmin } = useAuth();
	const action = useActionData();
	const [screenState, setScreenState] = useState<ScreenState>("poll");
	const params = useParams();
	const [currentAnswers, setCurrentAnswers] = useState(poll.answers);
	const [selectedVotes, setSelectedVotes] = useState<Voted[]>([]);
	const [pollStatus, setPollStatus] = useState(poll.status);
	const eightHours = 0.01 * 60 * 60 * 1000;
	const [timeLeft, { start, pause, resume, reset }] = useCountDown(
		timer + eightHours,
		1000
	);

	// Can't check this server-side unless uid is stored somewhere in a cookie or something
	const userHasVoted = poll.voted.find((voted) => voted.userId === user?.uid);

	useEffect(() => {
		if (userHasVoted) setScreenState("results");
	}, [user?.uid, userHasVoted]);

	const isChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked && poll.type === "radio") {
			return setSelectedVotes([
				...selectedVotes.filter(
					(selected) => selected.answerId === e.target.id
				),
				{
					answerId: e.target.id,
					userId: user?.uid || "empty",
				},
			]);
		}

		if (e.target.checked && poll.type === "checkbox") {
			setSelectedVotes([
				...selectedVotes,
				{
					answerId: e.target.id,
					userId: user?.uid || "empty",
				},
			]);
		} else {
			const selectedPoll = selectedVotes.filter(
				(selected) => selected.answerId !== e.target.id
			);

			setSelectedVotes(selectedPoll);
		}
	};

	//! Re-check this fn
	const isDefaultChecked = (answer: Answer) => {
		const findVotedAnswer = poll.voted
			.filter((voted) => voted.answerId === answer.id)
			.filter((voted) => voted.userId === user?.uid);

		console.log("find answer", findVotedAnswer);
		return findVotedAnswer.length > 0;
	};

	const getLengthOfAnswersById = (answerId: string) =>
		poll.voted.filter((voted) => voted.answerId === answerId);

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
	// ? For future: it would be cool if these functions happen on the server because they can be quite expensive on the frontend. UID on the server is needed
	const getGivenVotesByUser = poll.voted
		.filter((voted) => user?.uid === voted.userId)
		.map((voted) =>
			currentAnswers.find((answer) => answer.id === voted.answerId)
		);

	useEffect(() => {
		const app =
			getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

		const db = getFirestore(app);
		start();

		onSnapshot(doc(db, "polls", params?.id || ""), (doc) => {
			setPollStatus(doc.data()?.status);
		});
	}, []);

	useEffect(() => {
		if (timeLeft === 0) closePoll(params.id || "");
	}, [timeLeft]);

	return (
		<section>
			<Link to="/polls">Back to list of polls</Link>
			<h1>Poll #{poll.pollNumber}</h1>
			<PollStatus status={pollStatus} />
			<h3> {transformToCodeTags(poll.question)}</h3>

			{timeLeft}

			{/* <Countdown
				date={timer}
				renderer={({ hours, minutes, seconds, completed }) => {
					if (completed && pollStatus === "open") {
						closePoll(params.id || "");

						// Render a completed state
						return <h1>COmplete</h1>;
					} else {
						// Render a countdown
						return (
							<span>
								{hours} {minutes} {seconds}hours left until the
								poll will be closed! ⚠️
							</span>
						);
					}
				}}
			/> */}

			{screenState === "poll" && (
				<Form method="post">
					{action?.error && (
						<span>
							Please at least fill out one answer to submit
						</span>
					)}
					{poll.codeBlock && <pre>{poll.codeBlock}</pre>}
					<ul className="choices-list">
						{currentAnswers.map((answer, idx: number) => (
							<li key={idx} className="option-answer">
								<input
									disabled={pollStatus !== "open"}
									type={poll.type}
									id={answer.id}
									onChange={isChecked}
									// checked={isDefaultChecked(answer)}
									name="answer"
									value={answer.value}
								/>

								<label htmlFor={answer.id}>
									{answer.blockType === "code" ? (
										<pre>{answer.value}</pre>
									) : (
										<span className="text-question-answer">
											{transformToCodeTags(
												answer.value,
												idx
											)}
										</span>
									)}
								</label>
							</li>
						))}
					</ul>

					{user && (
						<button
							disabled={
								pollStatus !== "open" ||
								selectedVotes.length === 0
							}
						>
							Submit
						</button>
					)}
					{!user && (
						<small>Please login to submit your answer.</small>
					)}
					<input
						type="hidden"
						name="answers"
						defaultValue={JSON.stringify(currentAnswers)}
					/>
					<input
						type="hidden"
						name="selectedVotes"
						defaultValue={JSON.stringify(selectedVotes)}
					/>
					<input type="hidden" name="uid" defaultValue={user?.uid} />
				</Form>
			)}
			{screenState === "results" && (
				<>
					<ul className="choices-list results">
						{currentAnswers.map((answer, idx) => (
							<li
								key={answer.id}
								className={classNames("option-answer", {
									correct: getCorrectAnswers(answer.id),
								})}
							>
								{answer.blockType === "code" ? (
									<pre>{answer.value}</pre>
								) : (
									<span className="text-question-answer">
										{transformToCodeTags(answer.value, idx)}
									</span>
								)}
								<span>
									{getLengthOfAnswersById(answer.id).length}{" "}
									votes
								</span>

								{isAdmin && (
									<>
										voted by:{" "}
										{getVotesFromAllUsers(answer.id).map(
											(user) => (
												<strong key={user.id}>
													{user.email}{" "}
												</strong>
											)
										)}
									</>
								)}
							</li>
						))}
					</ul>
					<span>{responses} users voted</span>

					<ul className="choices-list results">
						<h1>You voted for:</h1>

						{getGivenVotesByUser.map((vote, idx) => (
							<li
								key={vote?.id}
								className={classNames("option-answer", {
									correct: getCorrectAnswers(vote?.id || ""),
									incorrect: !getCorrectAnswers(
										vote?.id || ""
									),
								})}
							>
								{vote?.blockType === "code" ? (
									<pre>{vote?.value}</pre>
								) : (
									<span className="text-question-answer">
										{transformToCodeTags(
											vote?.value || "",
											idx
										)}
									</span>
								)}
							</li>
						))}
					</ul>
				</>
			)}
		</section>
	);
}
