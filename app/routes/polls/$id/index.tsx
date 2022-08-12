import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { Answer, getPollById, PollData, updatePollById } from "~/utils/polls";
import { useAuth } from "~/providers/AuthProvider";
import React, { useState } from "react";

export const action: ActionFunction = async ({ request, params }) => {
	const formData = await request.formData();
	const answers = formData.get("answers") as string;
	const uid = formData.get("uid") as string;
	const paramId = params.id || "";
	const parsedAnswers = JSON.parse(answers) as Answer[];

	const hasVoted = parsedAnswers
		.map((answer) => answer.votedBy)
		.find((ids) => ids.includes(uid || ""))?.length;

	await getPollById(paramId);
	await updatePollById(paramId, {
		answers: [...parsedAnswers],
	});

	return {
		error: !hasVoted,
	};
};

type LoaderData = {
	poll: PollData;
};
export const loader: LoaderFunction = async ({ params }) => {
	const data = await getPollById(params.id || "");

	return { poll: data };
};

export default function PollDetail() {
	const { poll } = useLoaderData() as LoaderData;
	const { user } = useAuth();
	const action = useActionData();
	const [currentAnswers, setCurrentAnswers] = useState(poll.answers);

	const isChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			const updated = currentAnswers.map((answer) => {
				if (answer.id === e.target.id) {
					return {
						...answer,
						votedBy: [user?.uid || ""],
					};
				}
				return answer;
			});

			setCurrentAnswers(updated);
		} else {
			const updated = currentAnswers.map((answer) => {
				if (answer.id === e.target.id) {
					return {
						...answer,
						votedBy: answer.votedBy.filter(
							(id: string) => answer.id === id
						),
					};
				}
				return answer;
			});

			setCurrentAnswers(updated);
		}
	};

	const isDefaultChecked = (answer: Answer) =>
		!!answer.votedBy.find((id) => id === user?.uid);

	const userHasVoted = currentAnswers
		.map((answer) => answer.votedBy)
		.find((ids) => ids.includes(user?.uid || ""))?.length;

	return (
		<section>
			<Link to="/polls">Back to list of polls</Link>
			<h1>Poll #{poll.pollNumber}</h1>

			<>
				<span>
					Status: {poll.status} -{" "}
					{poll.status === "closed" ? (
						<span>
							it is not possible to submit to the poll anymore
						</span>
					) : (
						<span>the poll is open for responses!</span>
					)}
				</span>
			</>
			<Form method="post">
				<h3>{poll.question}</h3>
				{action?.error && (
					<span>Please at least fill out one answer to submit</span>
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

							<label htmlFor={answer.id}>{answer.value}</label>
						</li>
					))}
				</ul>

				{user && (
					<button
						disabled={poll.status === "closed" || !userHasVoted}
					>
						Submit
					</button>
				)}
				{!user && <small>Please login to submit your answer.</small>}
				<input
					type="hidden"
					name="answers"
					defaultValue={JSON.stringify(currentAnswers)}
				/>
				<input type="hidden" name="uid" defaultValue={user?.uid} />
			</Form>
		</section>
	);
}
