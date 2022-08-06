import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getDoc, doc } from "firebase/firestore";
import { getPollById } from "~/utils/polls";

import { useAuth } from "~/providers/AuthProvider";
import { db } from "~/utils/firebase";

export const action: ActionFunction = async ({ request }) => {
	console.log("action");
};
export const loader: LoaderFunction = async ({ params }) => {
	const data = await getPollById(params.id || "");

	return { poll: data };
};

export async function getPoll(id: string) {
	console.log("id", id);
	const snapshot = await getDoc(doc(db, "polls", id));

	if (!snapshot.exists) {
		throw Error("no doc exists");
	} else {
		return snapshot.data();
	}
}

export default function PollDetail() {
	const { poll } = useLoaderData();
	const { user } = useAuth();

	console.log("user", user);

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
				<button disabled={!user} onClick={() => {}}>
					Submit
				</button>
				{!user && <small>Please login to submit your answer.</small>}
			</>
		</section>
	);
}
