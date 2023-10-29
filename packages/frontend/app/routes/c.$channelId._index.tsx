// import type { ChannelDTO } from "@marcianosrs/engine";
import { getPolls } from "./api.server";
import { questionTypeStore, type PollDTO } from "@marcianosrs/engine";
import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { throwIfNotAuthorized } from "~/util/isAuthorized";
// import { useOutletContext } from "@remix-run/react";

type LoaderData = {
	poll: PollDTO;
};

export const loader: LoaderFunction = async ({ request }) => {
	await throwIfNotAuthorized(request);
	const polls = await getPolls();
	return json({ poll: polls[0] });
};

export default function Poll() {
	const { poll } = useLoaderData<LoaderData>();
	// const { channel } = useOutletContext<{ channel: ChannelDTO }>();

	if (!poll) {
		return (
			<div>
				<p>No Poll question found!</p>{" "}
			</div>
		);
	}

	const pollPlugin = questionTypeStore.get(poll.question.type);

	return (
		<main>
			<h2>Polls for this channel</h2>
			<pollPlugin.ShowQuestion
				mode="answer"
				settings={poll.question.data}
				onAnswer={(answerData, result) => {
					// answerData must be stored,
					// result must be processed through plugins and score systems
					// how much can we do in the handle action in terms of timing etc?
					console.log(answerData, result);
				}}
			/>
		</main>
	);
}
