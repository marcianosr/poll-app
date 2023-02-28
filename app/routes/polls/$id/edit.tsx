import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import PollForm, { Errors } from "~/admin/components/PollForm";
import { getPollById, PollData, updatePollById } from "~/utils/polls";
import styles from "~/styles/new-poll.css";
import { getAdminUser } from "~/utils/user";
import { useAuth } from "~/providers/AuthProvider";
import { PollCategory } from "~/utils/categories";
import { Title } from "~/ui/Title";
import { links as commonStyleLinks } from "../../polls/commonStyleLinks";

export function links() {
	return [...commonStyleLinks(), { rel: "stylesheet", href: styles }];
}
export const action: ActionFunction = async ({ request, params }) => {
	let formData = await request.formData();
	let errors: Partial<Errors> = {};

	const question = formData.get("question") as string;
	const correctAnswers = formData.get("correctAnswers") as string;
	const type = formData.get("type");
	const status = formData.get("status");
	const answers = formData.get("answers") as string;
	const category = formData.get("category") as PollCategory;
	const codeBlock = formData.get("codeBlock") as string | null;
	const codeSandboxExample = formData.get("codesandboxExample") as
		| string
		| null;

	for (const [key, value] of formData.entries()) {
		if (
			!value &&
			key !== "codeBlock" &&
			!value &&
			key !== "codesandboxExample"
		)
			errors[key] = true;
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
		codeSandboxExample,
		...(status === "open" && { openingTime: Date.now() }),
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

	return (
		<section className="container">
			<Link to="/polls">Back to list of polls</Link>
			<Title size="xl" variant="primary">
				Edit poll #{poll.pollNumber}
			</Title>
			<PollForm poll={poll} />
		</section>
	);
}
