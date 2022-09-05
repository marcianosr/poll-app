import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import PollForm, { Errors } from "~/components/PollForm";
import {
	getPollById,
	PollCategory,
	PollData,
	updatePollById,
} from "~/utils/polls";
import styles from "~/styles/new-poll.css";
import { getAdminUser } from "~/utils/user";
import { useAuth } from "~/providers/AuthProvider";

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
	const status = formData.get("status");
	const answers = formData.get("answers") as string;
	const category = formData.get("category") as PollCategory;
	const codeBlock = formData.get("codeBlock") as string | null;

	for (const [key, value] of formData.entries()) {
		if (!value) errors[key] = true;
	}

	if (Object.keys(errors).length)
		return {
			ok: false,
			errors: {
				...errors,
			},
		};

	// Add old pollData
	const updatePoll = await updatePollById(params.id || "", {
		question,
		correctAnswers: JSON.parse(correctAnswers),
		answers: JSON.parse(answers),
		type,
		status,
		category,
		codeBlock,
	});

	return {
		ok: true,
	};
};

export const loader: LoaderFunction = async ({ params }) => {
	// const isAdmin =
	// 	(await (await getAdminUser()).map((user) => user.role)[0]) === "admin";

	// if (!isAdmin) {
	// 	return redirect("/");
	// }

	const data = await getPollById(params.id || "");

	return { poll: data };
};

export default function EditPoll() {
	const { poll } = useLoaderData();
	const { isAdmin } = useAuth();

	if (!isAdmin) {
		return <h1>404 Not Found</h1>;
	}
	// console.log("edit", poll);
	return (
		<section>
			<Link to="/polls">Back to list of polls</Link>

			<h1>Edit poll #{poll.pollNumber}</h1>
			<PollForm poll={poll} />
		</section>
	);
}
