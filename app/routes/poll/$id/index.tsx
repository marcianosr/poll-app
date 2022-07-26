import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { getPollById } from "~/utils/polls";

// Page to submit poll for the users

export const action: ActionFunction = async ({ request }) => {
	console.log("action");
};
export const loader: LoaderFunction = async ({ params }) => {
	const data = await getPollById(params.id || "");

	return { poll: data };
};

export async function getPoll(id: string) {
	console.log("id", id);
	// const snapshot = await db.collection("polls").get();
	// const data: any = [];
	// snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));

	const snapshot = await db.collection("polls").doc(id).get();

	if (!snapshot.exists) {
		throw Error("no doc exists");
	} else {
		return snapshot.data();
	}
}

export default function PollDetail() {
	const { poll } = useLoaderData();

	console.log("poll", poll);

	return (
		<section>
			<h1>Poll #{poll.pollNumber}</h1>

			<>
				<h3>{poll.question}</h3>
				<ul>
					{poll.answers.map((answer: any, idx: number) => (
						<li key={idx}>
							<input
								type={poll.type}
								id={idx.toString()}
								name="answer"
							/>
							<label htmlFor={idx.toString()}>
								{answer.value}
							</label>
						</li>
					))}
				</ul>
			</>
		</section>
	);
}
