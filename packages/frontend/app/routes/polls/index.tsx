import { LoaderFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/lib/firebaseAdmin.server";
import { isSessionValid } from "~/util/session.server";

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
	const isLoggedIn = !!decodedClaims?.email;

	if (!isLoggedIn) {
		throw new Response(null, {
			status: 404,
			statusText: "Not Found",
		});
	}

	// move to engine?
	const collection = await db.collection("polls").get();
	const polls = collection.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}));

	return json({ polls });
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
