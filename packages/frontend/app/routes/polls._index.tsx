import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { API_ENDPOINT } from "~/util";
import { throwIfNotAuthorized } from "~/util/isAuthorized";
import { getSession } from "~/util/session.server";
import type { Poll } from "@marcianosrs/engine";

type LoaderData = {
	polls: Poll[];
};

export const loader: LoaderFunction = async ({ request }) => {
	const session = await getSession(request.headers.get("cookie"));

	await throwIfNotAuthorized(request);

	const response = await fetch(`${API_ENDPOINT}/polls`, {
		headers: {
			Authorization: `Bearer ${session.get("accessToken")}`,
		},
	});

	const data = await response.json();

	return json({ polls: data });
};

export default function Index() {
	const { polls } = useLoaderData<LoaderData>();

	return (
		<main>
			<h1>Polls</h1>
			<Link to={"/polls/new"}>Create new poll</Link>
			<ul>
				{polls.map((poll) => (
					<li key={poll.id}>
						#{poll.no} - {poll.question}
						<Link to={`/polls/${poll.id}`}>Go to poll</Link>
					</li>
				))}
			</ul>
		</main>
	);
}
