import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { API_ENDPOINT } from "~/util";

import { getSession, isSessionValid } from "~/util/session.server";

// move to engine?
type PollType =
	| "challenge"
	| "single-choice"
	| "multiple-choice"
	| "spot-the-bug";

type PollAnswerType = "text" | "code";
type PollTags =
	| "javascript"
	| "typescript"
	| "react"
	| "a11y"
	| "css"
	| "html"
	| "git"
	| "general-frontend"
	| "general-backend"
	| "flutter";

type PollAnswer = {
	id: string;
	value: string;
	isCorrect: boolean;
	type: PollAnswerType;
};
type Poll = {
	id: string;
	question: string;
	answers: PollAnswer[];
	type: PollType;
	no: number;
	tags: PollTags[];
	createdAt: number;
	createdBy: string;
	level: "very-easy" | "easy" | "medium" | "hard" | "expert" | "god";
};

type LoaderData = {
	polls: Poll[];
};

export const loader: LoaderFunction = async ({ request }) => {
	const { decodedClaims, error } = await isSessionValid(request);
	const session = await getSession(request.headers.get("cookie"));

	const isLoggedIn = !!decodedClaims?.email;

	if (!isLoggedIn) {
		throw new Response(null, {
			status: 404,
			statusText: "Not Found",
		});
	}

	const response = await fetch(`${API_ENDPOINT}/polls`, {
		headers: {
			Authorization: `Bearer ${session.get("accessToken")}`,
		},
	});

	const data = await response.json();

	return json({ polls: data });
};

export default function Index() {
	const { polls } = useLoaderData<LoaderData>();

	return (
		<main>
			<h1>Polls</h1>
			<Link to={"/polls/new"}>Create new poll</Link>
			<ul>
				{polls.map((poll) => (
					<li key={poll.id}>
						#{poll.no} - {poll.question}
					</li>
				))}
			</ul>
		</main>
	);
}
