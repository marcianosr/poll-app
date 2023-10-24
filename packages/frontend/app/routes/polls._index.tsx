import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { throwIfNotAuthorized } from "~/util/isAuthorized";
import { questionTypeStore, type PollDTO } from "@marcianosrs/engine";
import { getPolls } from "./api.server";

type LoaderData = {
	polls: PollDTO[];
};

export const loader: LoaderFunction = async ({ request }) => {
	await throwIfNotAuthorized(request);

	const polls = await getPolls();
	return json({ polls });
};

export default function Index() {
	const { polls } = useLoaderData<LoaderData>();

	return (
		<main>
			<h1>Polls</h1>
			<Link to={"/polls/new"}>Create new poll</Link>

			<ul>
				{polls.map((poll) => {
					const pluginType = poll.question.type;
					const plugin = questionTypeStore.get(pluginType);
					const name = plugin.getContentTitle(poll.question.data);

					return (
						<li key={poll.id}>
							# {name}{" "}
							<Link to={`/polls/${poll.id}`}>Go to poll</Link>{" "}
							<Link to={`/polls/${poll.id}/edit`}>Edit</Link>
						</li>
					);
				})}
			</ul>
		</main>
	);
}
