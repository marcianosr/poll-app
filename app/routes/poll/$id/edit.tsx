import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PollForm from "~/components/PollForm";
import { getPollById, PollData, updatePollById } from "~/utils/polls";
import styles from "~/styles/new-poll.css";

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const action: ActionFunction = async ({ request, params }) => {
	console.log("id:", params.id);

	let formData = await request.formData();

	const question = formData.get("question") as string;
	const correctAnswers = formData.get("correctAnswers") as string;
	const answers = [];

	for (var [key, value] of formData.entries()) {
		if (key.includes("answer")) {
			answers.push({
				id: key.split("answer-")[1], // ID of the the field
				value: value as string,
			});
		}
	}

	const updatePoll = await updatePollById(params.id || "", {
		question,
		correctAnswers: JSON.parse(correctAnswers),
		answers,
	});

	return {
		ok: true,
	};
};

export const loader: LoaderFunction = async ({ params }) => {
	const data = await getPollById(params.id || "");

	return { poll: data };
};

export default function EditPoll() {
	const { poll } = useLoaderData();
	console.log("edit", poll);
	return (
		<section>
			<h1>Edit poll #{poll.pollNumber}</h1>
			<PollForm poll={poll} />
		</section>
	);
}
