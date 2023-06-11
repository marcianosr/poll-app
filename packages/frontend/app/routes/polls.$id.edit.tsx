import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { v4 as uuidv4 } from "uuid";
import { API_ENDPOINT } from "~/util";
import { throwIfNotAuthorized } from "~/util/isAuthorized";
import { getSession, isSessionValid } from "~/util/session.server";
import type {
	PollType,
	PollOption,
	CreatePoll,
	POLL_TAGS,
	Poll,
	UpdatePoll,
} from "@marcianosrs/engine";
import { PollForm } from "./polls.new";

export const action = async ({ request, params }: ActionArgs) => {
	await throwIfNotAuthorized(request);

	const { decodedClaims } = await isSessionValid(request);
	const session = await getSession(request.headers.get("cookie"));

	let formData = await request.formData();
	const question = formData.get("question") as string;
	const type = formData.get("type") as PollType;
	const tags = formData.getAll("tags") as (typeof POLL_TAGS)[number][];
	const options = JSON.parse(
		formData.get("options") as string
	) as PollOption[];
	const visualCodeExample = formData.get("visualCodeExample") as string;
	const codeBlockExample = formData.get("codeBlockExample") as string;

	const poll: UpdatePoll = {
		question,
		type,
		tags,
		options,
		codeBlockExample,
		visualCodeExample,
	};

	const id = params.id || "";

	const updatePoll = async () => {
		const response = await fetch(`${API_ENDPOINT}/polls/${id}/edit`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${session.get("accessToken")}`,
			},
			body: JSON.stringify(poll),
		});

		return response.json();
	};

	const errors = await updatePoll();

	if (errors.length > 0) {
		return {
			errors: errors,
		};
	}

	console.log("errors", errors);

	return redirect("/polls");
};

export const loader: LoaderFunction = async ({ request, params }) => {
	await throwIfNotAuthorized(request);

	const getPollById = async (id: string) => {
		const response = await fetch(`${API_ENDPOINT}/polls/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		return response.json();
	};

	return { poll: await getPollById(params.id || "") };
};

export default function EditPoll() {
	const { poll } = useLoaderData<{ poll: Poll }>();

	console.log("update poll", poll);
	return (
		<main>
			<Link to="/polls">Back to list of polls</Link>
			<h1>Edit poll #{poll.no}</h1>
			<PollForm poll={poll} />
		</main>
	);
}
