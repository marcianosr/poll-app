import React, { Fragment, useEffect, useState } from "react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
	Form,
	Link,
	useActionData,
	useLoaderData,
	useTransition,
} from "@remix-run/react";
import {
	Answer,
	Voted,
	getPollById,
	PollData,
	updatePollById,
	getPollsByOpeningTime,
	getAmountOfClosedPolls,
	getAllPolls,
	getKabisaPollById,
	updateKabisa,
} from "~/utils/polls";
import { FirebaseUserFields, useAuth } from "~/providers/AuthProvider";
import { PollStatusInfo } from "~/components/PollStatusInfo";
import { getUserByID, getUsers, updateUserById } from "~/utils/user";
import { DeepPartial } from "~/utils/types";
import styles from "~/styles/poll.css";
import classNames from "classnames";

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

	const polls = (await getKabisaPollById("60y9Z3Nl1HENGoWaN576")) as PollData;

	await updateKabisa("60y9Z3Nl1HENGoWaN576", {
		voted: [...polls.voted, ...parsedVoted],
	});

	const currentUser = await getUserByID(uid);

	await updateUserById<UpdateScore>({
		id: uid,
		polls: {
			answeredById: [
				...currentUser?.polls.answeredById,
				"60y9Z3Nl1HENGoWaN576",
			],
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
	polls: PollData[];
	responses: number;
	users: any; // !TODO: type this
	openedPollNumber: number;
};

export const loader: LoaderFunction = async ({ params }) => {
	const data = await getKabisaPollById("60y9Z3Nl1HENGoWaN576");

	// console.log("data", data);
	const users = await getUsers();

	const getUserIdsByVote = data?.voted
		.map((votes: Voted) => votes.userId)
		.flat();

	const responses = new Set([...getUserIdsByVote]).size;

	return { poll: data, responses, users };
};

export default function PollDetail() {
	const { poll, responses, users } = useLoaderData() as LoaderData;
	const { user, isAdmin } = useAuth();
	const action = useActionData();
	const transition = useTransition();

	const [screenState, setScreenState] = useState<ScreenState>("poll");
	const [showVotedBy, setShowVotedBy] = useState(false);

	const [currentAnswers, setCurrentAnswers] = useState(poll.answers);
	const [selectedVotes, setSelectedVotes] = useState<Voted[]>([]);

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

	return (
		<section>
			<Link to="/polls">Back to list of polls</Link>
			{isAdmin && (
				<input
					type="checkbox"
					id="votedBy"
					onChange={() => setShowVotedBy(!showVotedBy)}
					name="votedBy"
				/>
			)}
			<PollStatusInfo status={poll.status} />
			<h3>{poll.question}</h3>
			<h1>Kabisa poll</h1>
			{screenState === "poll" && (
				<Form method="post">
					{action?.error && (
						<span>
							Please at least fill out one answer to submit
						</span>
					)}
					{poll.codeBlock && <pre>{poll.codeBlock}</pre>}
					{user?.uid && (
						<ul className="choices-list">
							{currentAnswers.map((answer, idx: number) => (
								<>
									<li key={idx} className="option-answer">
										<input
											disabled={poll.status !== "open"}
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
													{answer.value}
												</span>
											)}
										</label>
									</li>
									{showVotedBy && isAdmin && (
										<>
											voted by:{" "}
											{getVotesFromAllUsers(
												answer.id
											).map((user) => (
												<strong key={user.id}>
													{user.email}{" "}
												</strong>
											))}
										</>
									)}
								</>
							))}
						</ul>
					)}
					{user && (
						<button
							disabled={
								poll.status !== "open" ||
								selectedVotes.length === 0 ||
								transition.state === "submitting" ||
								transition.state === "loading"
							}
						>
							{transition.state === "submitting" ||
							transition.state === "loading"
								? "Submitting... No button mashing! NEENER NEENER!"
								: "Submit"}
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
										{answer.value}
									</span>
								)}
								<span>
									{getLengthOfAnswersById(answer.id).length}{" "}
									votes
								</span>

								{showVotedBy && isAdmin && (
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
										{vote?.value}
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
