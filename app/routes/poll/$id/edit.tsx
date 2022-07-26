import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PollForm from "~/components/PollForm";
import { getPollById } from "~/utils/polls";

export const action: ActionFunction = async ({ request, params }) => {
	console.log("id:", params.id);

	const pollId = params.id;

	let formData = await request.formData();

	const question = formData.get("question") as string;
	const correctAnswers = formData.get("correctAnswers") as string;

	console.log("question", question);
	console.log("correctAnswers", correctAnswers);
	//update document by id

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
