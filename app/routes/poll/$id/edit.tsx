import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PollForm, { Errors } from "~/components/PollForm";
import { getPollById, PollData, updatePollById } from "~/utils/polls";
import styles from "~/styles/new-poll.css";

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const action: ActionFunction = async ({ request, params }) => {
	console.log("id:", params.id);

	let formData = await request.formData();
	let errors: Partial<Errors> = {};

	const question = formData.get("question") as string;
	const correctAnswers = formData.get("correctAnswers") as string;
	const type = formData.get("type");
	const answers = [];

	for (var [key, value] of formData.entries()) {
		if (!value) errors[key] = true;

		if (key.includes("answer")) {
			answers.push({
				id: key.split("answer-")[1], // ID of the the field
				value: value as string,
			});
		}
	}

	if (Object.keys(errors).length)
		return {
			ok: false,
			errors: {
				...errors,
			},
		};

	const updatePoll = await updatePollById(params.id || "", {
		question,
		correctAnswers: JSON.parse(correctAnswers),
		answers,
		type,
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
