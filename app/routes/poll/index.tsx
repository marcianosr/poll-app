import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getAllPolls, getDocumentPollIds, PollData } from "~/utils/polls";

export const loader: LoaderFunction = async ({ params }) => {
	const data = await getAllPolls();

	const ids = await getDocumentPollIds();

	return { polls: data, docId: ids };
};

export default function AllPolls() {
	const { polls, docId } = useLoaderData();

	return (
		<section>
			<h1>All polls</h1>
			<ul>
				{polls.map((poll: PollData, idx: number) => (
					<li key={poll.id}>
						<p>
							#{poll.pollNumber} - {poll.question}
						</p>
						<Link to={`/poll/${docId[idx]}/edit`}>Edit</Link>{" "}
						<Link to={`/poll/${docId[idx]}`}>Go to poll</Link>
					</li>
				))}
			</ul>
		</section>
	);
}
