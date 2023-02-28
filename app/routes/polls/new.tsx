import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { v4 as uuidv4 } from "uuid";
import FormPoll, { Errors } from "~/admin/components/PollForm";
import {
	createPoll,
	getAmountOfPolls,
	PollData,
	PollStatus,
} from "~/utils/polls";
import { PollCategory } from "~/utils/categories";
import { Title } from "~/ui/Title";
import { links as commonStyleLinks } from "../polls/commonStyleLinks";
import styles from "~/styles/new-poll.css";

export function links() {
	return [...commonStyleLinks(), { rel: "stylesheet", href: styles }];
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
	const sentInByUser = formData.get("sentInByUser") as string;
	const codeSandboxExample = formData.get("codesandboxExample") as string;

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
		codeSandboxExample: codeSandboxExample || "",
		sentInByUser: JSON.parse(sentInByUser),
		...(status === "open" && { openingTime: Date.now() }),
	};

	for (const [key, value] of formData.entries()) {
		// console.log("----->>>>>", key, value);

		if (
			!value &&
			key !== "codeBlock" &&
			!value &&
			key !== "codesandboxExample"
		)
			errors[key] = true;
	}

	console.log(errors);
	if (Object.keys(errors).length)
		return {
			ok: false,
			errors: {
				...errors,
			},
		};

	await createPoll(pollData);

	return redirect("/polls");
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
	const { totalPolls } = useLoaderData();

	return (
		<section className="container">
			<Link to="/polls">Back to list of polls</Link>

			<Title size="xl" variant="primary">
				Add a new poll: #{totalPolls + 1}
			</Title>
			<FormPoll />
		</section>
	);
}
