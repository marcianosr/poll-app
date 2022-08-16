import React, { useEffect, useState } from "react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import {
	Answer,
	Voted,
	getPollById,
	PollData,
	updatePollById,
} from "~/utils/polls";
import { useAuth } from "~/providers/AuthProvider";
import PollStatus from "~/components/PollStatus";

type ScreenState = "poll" | "results";

export const action: ActionFunction = async ({ request, params }) => {
	const formData = await request.formData();
	const voted = formData.get("voted") as string;
	const uid = formData.get("uid") as string;
	const paramId = params.id || "";
	const parsedVoted = JSON.parse(voted) as Voted[];

	await updatePollById(paramId, {
		voted: [...parsedVoted],
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
};
export const loader: LoaderFunction = async ({ params }) => {
	const data = await getPollById(params.id || "");

	const getUserIdsByVote = data?.voted
		.map((votes: Voted) => votes.userId)
		.flat();

	const responses = new Set([...getUserIdsByVote]).size;

	return { poll: data, responses };
};

export default function PollDetail() {
	const { poll, responses } = useLoaderData() as LoaderData;
	const { user } = useAuth();
	const action = useActionData();

	const [screenState, setScreenState] = useState<ScreenState>("poll");

	const [currentAnswers, setCurrentAnswers] = useState(poll.answers);
	const [currentVoted, setCurrentVoted] = useState<Voted[]>(poll.voted);

	// Can't check this server-side unless uid is stored somewhere in a cookie or something
	const userHasVoted = poll.voted.find((voted) => voted.userId === user?.uid);

	useEffect(() => {
		if (userHasVoted) setScreenState("results");
	}, [user?.uid, userHasVoted]);

	const isChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setCurrentVoted([
				...currentVoted,
				{
					answerId: e.target.id,
					userId: user?.uid || "",
				},
			]);
		} else {
			const votedPoll = currentVoted.filter(
				(voted) => voted.answerId !== e.target.id
			);

			setCurrentVoted(votedPoll);
		}
	};

	const isDefaultChecked = (answer: Answer) => {
		const findVotedAnswer = currentVoted
			.filter((voted) => voted.answerId === answer.id)
			.filter((voted) => voted.userId === user?.uid);

		return findVotedAnswer.length > 0;
	};

	const getLengthOfAnswersById = (answerId: string) =>
		currentVoted.filter((voted) => voted.answerId === answerId);

	const getCorrectAnswers = (answerId: string) =>
		!!poll.correctAnswers.find((correct) => correct.id === answerId);

	return (
		<section>
			<Link to="/polls">Back to list of polls</Link>
			<h1>Poll #{poll.pollNumber}</h1>
			<PollStatus status={poll.status} />
			{screenState === "poll" && (
				<Form method="post">
					<h3>{poll.question}</h3>
					{action?.error && (
						<span>
							Please at least fill out one answer to submit
						</span>
					)}
					<ul>
						{currentAnswers.map((answer, idx: number) => (
							<li key={idx}>
								<input
									disabled={poll.status === "closed"}
									type={poll.type}
									id={answer.id}
									onChange={isChecked}
									checked={isDefaultChecked(answer)}
									name="answer"
									value={answer.value}
								/>

								<label htmlFor={answer.id}>
									{answer.value}
								</label>
							</li>
						))}
					</ul>

					{user && (
						<button
							disabled={
								poll.status === "closed" ||
								currentVoted.length === 0
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
						name="voted"
						defaultValue={JSON.stringify(currentVoted)}
					/>
					<input type="hidden" name="uid" defaultValue={user?.uid} />
				</Form>
			)}
			{screenState === "results" && (
				<>
					<ul>
						{currentAnswers.map((answer, idx) => (
							<li key={answer.id}>
								{answer.value} -{" "}
								{getLengthOfAnswersById(answer.id).length} -{" "}
								{getCorrectAnswers(answer.id) && (
									<span>correct</span>
								)}{" "}
							</li>
						))}
					</ul>
					<span>{responses} users voted</span>
				</>
			)}
		</section>
	);
}
