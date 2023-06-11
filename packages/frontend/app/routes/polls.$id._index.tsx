import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { API_ENDPOINT } from "~/util";
import { throwIfNotAuthorized } from "~/util/isAuthorized";
import { getSession, isSessionValid } from "~/util/session.server";
import type { Poll } from "@marcianosrs/engine";
import { useState } from "react";

type LoaderData = {
	poll: Poll;
};

export const action: ActionFunction = async ({ request, params }) => {
	await throwIfNotAuthorized(request);

	const { decodedClaims } = await isSessionValid(request);
	const session = await getSession(request.headers.get("cookie"));

	const formData = await request.formData();
	const votes = formData.getAll("options");

	console.log(votes, decodedClaims);

	return {};
};

export const loader: LoaderFunction = async ({ request, params }) => {
	const session = await getSession(request.headers.get("cookie"));

	await throwIfNotAuthorized(request);

	const getPollById = async (id: string) => {
		const response = await fetch(`${API_ENDPOINT}/polls/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${session.get("accessToken")}`,
			},
		});

		return response.json();
	};

	return json({ poll: await getPollById(params.id || "") });
};

export default function PollDetail() {
	const { poll } = useLoaderData<LoaderData>();
	const [selectedVotes, setSelectedVotes] = useState<string[]>([]);
	const transition = useNavigation();

	const isVoteButtonDisabled =
		selectedVotes.length === 0 ||
		transition.state === "submitting" ||
		transition.state === "loading";

	return (
		<main>
			<small>#{poll.no}</small>
			<h1>{poll.question}</h1>
			<ul>
				{poll.tags.map((tag) => (
					<li key={tag}>{tag}</li>
				))}
			</ul>

			<Form method="POST">
				<ul>
					{poll.options.map((option) => (
						<li key={option.id}>
							<label htmlFor={option.id}>{option.value}</label>
							<input
								id={option.id}
								name="votes"
								value={option.value}
								onChange={(e) => {
									if (poll.type === "single-choice") {
										setSelectedVotes([e.target.value]);
									}

									if (poll.type === "multiple-choice") {
										setSelectedVotes([
											...selectedVotes,
											e.target.value,
										]);
									}
								}}
								type={
									poll.type === "single-choice"
										? "radio"
										: "checkbox"
								}
							/>
						</li>
					))}
				</ul>
				<button type="submit" disabled={isVoteButtonDisabled}>
					Cast your vote
				</button>
			</Form>
		</main>
	);
}
