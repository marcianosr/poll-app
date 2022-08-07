import {
	ActionFunction,
	json,
	LoaderFunction,
	redirect,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getAllPolls, getDocumentPollIds, PollData } from "~/utils/polls";
import { getAdminUser } from "~/utils/user";

export const loader: LoaderFunction = async ({ params }) => {
	const isAdmin =
		(await (await getAdminUser()).map((user) => user.role)[0]) === "admin";
	if (!isAdmin) {
		return redirect("/");
	}
	const data = await getAllPolls();

	const ids = await getDocumentPollIds();

	return { polls: data, docId: ids };
};

export default function AllPolls() {
	const { polls, docId } = useLoaderData();

	return (
		<section>
			<h1>All polls</h1>
			<Link to="/polls/new">Create new poll</Link>
			<ul>
				{polls.map((poll: PollData, idx: number) => (
					<li key={poll.id}>
						<p>
							#{poll.pollNumber} - {poll.question}
						</p>
						<Link to={`/polls/${docId[idx]}/edit`}>Edit</Link>
						<Link to={`/polls/${docId[idx]}`}>Go to poll</Link>
					</li>
				))}
			</ul>
		</section>
	);
}
