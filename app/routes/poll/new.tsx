import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { v4 as uuidv4 } from "uuid";
import FormPoll, { Errors } from "../../components/PollForm";

import styles from "~/styles/new-poll.css";
import { createPoll, getAmountOfPolls, PollData } from "~/utils/polls";

import { useAuth } from "~/providers/AuthProvider";
import { useEffect } from "react";
import { getAdminUser } from "~/utils/user";

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

	const pollData: PollData = {
		id,
		question,
		answers: [],
		correctAnswers: JSON.parse(correctAnswers),
		pollNumber: pollsLength + 1,
		type,
	};

	for (var [key, value] of formData.entries()) {
		// console.log("----->>>>>", key, value);

		if (!value) errors[key] = true;

		if (key.includes("answer")) {
			pollData.answers.push({
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

	await createPoll(pollData);
	return {
		ok: true,
		...pollData,
	};
};

export const loader: LoaderFunction = async ({ params }) => {
	const isAdmin =
		(await (await getAdminUser()).map((user) => user.role)[0]) === "admin";
	if (!isAdmin) {
		return redirect("/");
	}

	const data = await getAmountOfPolls();

	return { totalPolls: data };
};

export default function NewPoll() {
	const { totalPolls } = useLoaderData();

	return (
		<section>
			<h1>Poll #{totalPolls + 1}</h1>
			<FormPoll />
		</section>
	);
}
