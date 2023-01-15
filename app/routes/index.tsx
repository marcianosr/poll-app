import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getAmountOfClosedPolls, getPollsByStatus } from "~/utils/polls";

export const loader: LoaderFunction = async ({ params }) => {
	const polls = await getPollsByStatus("open");
	const closedPolls = await getAmountOfClosedPolls();

	return { polls, closedPolls };
};

export default function Index() {
	const { polls: openPoll, closedPolls } = useLoaderData();

	console.log("home");

	return (
		<section style={{ display: "flex", justifyContent: "center" }}>
			<h1>
				<Link
					style={{ color: "white" }}
					to={`polls/${openPoll.documentId}`}
				>
					Go to poll
				</Link>
			</h1>
		</section>
	);
}
