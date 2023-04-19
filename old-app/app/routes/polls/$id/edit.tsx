import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import PollForm, { Errors } from "~/admin/components/PollForm";
import { getPollById, PollData, updatePollById, Voted } from "~/utils/polls";
import styles from "~/styles/new-poll.css";
import { getUserByID, updateUserById } from "~/utils/user";
import { useAuth } from "~/providers/AuthProvider";
import { PollCategory } from "~/utils/categories";
import { Title } from "~/ui/Title";
import { links as commonStyleLinks } from "../../polls/commonStyleLinks";
import { links as commonCRUDPollLinks } from "../../polls/commonCRUDPollLinks";

export function links() {
	return [
		...commonStyleLinks(),
		...commonCRUDPollLinks(),
		{ rel: "stylesheet", href: styles },
	];
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

	const pollData = await getPollById(params.id || "");

	const pointsByUserId = pollData?.voted.reduce(
		(acc: Record<string, number>, voted: Voted) => {
			const userId = voted.userId;
			const answer = pollData?.answers.find(
				(poll: PollData) => poll.id === voted.answerId
			);

			const points = answer ? answer.points : 0;

			return {
				...acc,
				[userId]: (acc[userId] || 0) + points,
			};
		},
		{}
	);

	// Correct user points when needed
	Object.entries(pointsByUserId).forEach(async ([userId, points]) => {
		const currentUser = await getUserByID(userId);

		await updateUserById({
			id: userId,
			polls: {
				correct: currentUser?.polls.oldCorrect + points,
			},
		});
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
