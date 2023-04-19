import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getAmountOfClosedPolls, getOpenPoll } from "~/utils/polls";

export const loader: LoaderFunction = async ({ params }) => {
	const polls = await getOpenPoll();
	const closedPolls = await getAmountOfClosedPolls();

	return { polls, closedPolls };
};

export default function Index() {
	const { polls: currentOpenPoll, closedPolls } = useLoaderData();

	return (
		<section
			style={{
				display: "flex",
				justifyContent: "center",
				color: "white",
			}}
		>
			{currentOpenPoll.length ? (
				<h1>
					<Link to={`polls/${currentOpenPoll.documentId}`}>
						Go to poll
					</Link>
				</h1>
			) : (
				<h1>Sorry, no polls open right now.</h1>
			)}
		</section>
	);
}
