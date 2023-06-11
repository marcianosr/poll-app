import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { API_ENDPOINT } from "~/util";
import { throwIfNotAuthorized } from "~/util/isAuthorized";
import { getSession } from "~/util/session.server";
import type { Poll } from "@marcianosrs/engine";

type LoaderData = {
	poll: Poll;
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

	return (
		<main>
			<small>#{poll.no}</small>
			<h1>{poll.question}</h1>
			<ul>
				{poll.tags.map((tag) => (
					<li key={tag}>{tag}</li>
				))}
			</ul>
			<ul>
				{poll.options.map((option) => (
					<li key={option.id}>{option.value}</li>
				))}
			</ul>
		</main>
	);
}
