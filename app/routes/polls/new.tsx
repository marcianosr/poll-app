import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { v4 as uuidv4 } from "uuid";
import FormPoll, { BlockType, Errors } from "../../components/PollForm";
import {
	createPoll,
	getAmountOfPolls,
	PollCategory,
	PollData,
	PollStatus,
} from "~/utils/polls";
import { getAdminUser } from "~/utils/user";
import styles from "~/styles/new-poll.css";
import { useAuth } from "~/providers/AuthProvider";

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const action: ActionFunction = async ({ request }) => {
	const pollsLength = await getAmountOfPolls();
	const id = uuidv4();
	let formData = await request.formData();
	let errors: Partial<Errors> = {};

	const question = formData.get("question") as string;
	const correctAnswers = formData.get("correctAnswers") as string;
	const type = formData.get("type") as string;
	const status = formData.get("status") as PollStatus;
	const answers = formData.get("answers") as string;
	const parsedAnswers = JSON.parse(answers);
	const category = formData.get("category") as PollCategory;
	const codeBlock = formData.get("codeBlock") as string | null;

	const pollData: PollData = {
		id,
		question,
		answers: parsedAnswers,
		voted: [],
		correctAnswers: JSON.parse(correctAnswers),
		pollNumber: pollsLength + 1,
		type,
		status,
		category,
		codeBlock: codeBlock || "",
	};

	for (const [key, value] of formData.entries()) {
		// console.log("----->>>>>", key, value);

		if (!value) errors[key] = true;
	}
	console.log("errors", errors);

	if (Object.keys(errors).length)
		return {
			ok: false,
			errors: {
				...errors,
			},
		};

	console.log(pollData);

	await createPoll(pollData);
	return {
		ok: true,
		...pollData,
	};
};

export const loader: LoaderFunction = async ({ params }) => {
	const data = await getAmountOfPolls();

	return { totalPolls: data };
};

export default function NewPoll() {
	const { isAdmin } = useAuth();
	const { totalPolls } = useLoaderData();

	if (!isAdmin) {
		return <h1>404 Not Found</h1>;
	}

	return (
		<section>
			<Link to="/polls">Back to list of polls</Link>

			<h1>Poll #{totalPolls + 1}</h1>
			<FormPoll />
		</section>
	);
}
