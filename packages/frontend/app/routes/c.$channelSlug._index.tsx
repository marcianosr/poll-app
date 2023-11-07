import { objectToFormMapping } from "@marcianosrs/form";
import {
	getChannelBySlug,
	getOpenPollForChannel,
	getPollById,
} from "./api.server";
import { questionTypeStore } from "@marcianosrs/engine";
import type { PollDTO, ChannelPollItemDTO } from "@marcianosrs/engine";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useOutletContext, useSubmit } from "@remix-run/react";
import { throwIfNotAuthorized } from "~/util/isAuthorized";
import { parse } from "qs";
import { answerPollQuestion } from "./poll.server";

type LoaderData = {
	channelPoll: ChannelPollItemDTO | null;
	poll: PollDTO | null;
	userId: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
	await throwIfNotAuthorized(request);
	const slug = params.channelSlug;
	if (slug === undefined) {
		return null;
	}
	const channel = await getChannelBySlug(slug);
	const channelPoll = channel && (await getOpenPollForChannel(channel.id));
	const poll = channelPoll && (await getPollById(channelPoll.pollId));

	return json({ channelPoll, poll });
};

export const action: ActionFunction = async ({ request, params }) => {
	const { decodedClaims } = await throwIfNotAuthorized(request);

	const channelSlug = params.channelSlug;
	if (channelSlug === undefined) {
		return null;
	}

	const data = await request.text();
	const formData = parse(data);

	await answerPollQuestion(channelSlug, formData, decodedClaims.uid);

	return redirect(`/c/${channelSlug}/`);
};

const objectToFormData = (answerData: Record<string, unknown>): FormData => {
	const result = new FormData();
	for (const [key, value] of Object.entries(
		objectToFormMapping([], answerData)
	)) {
		result.append(key, value);
	}

	return result;
};

export default function Poll() {
	const { poll, channelPoll } = useLoaderData<LoaderData>();
	const { userId } = useOutletContext<{ userId: string }>();
	const submit = useSubmit();

	if (!poll) {
		return (
			<div>
				<p>No Poll question found!</p>
			</div>
		);
	}

	const pollPlugin = questionTypeStore.get(poll.question.type);

	const mode = channelPoll?.answers.some((a) => a.userId === userId)
		? "result"
		: "answer";

	return (
		<main>
			<h2>Polls for this channel</h2>
			<pollPlugin.ShowQuestion
				mode={mode}
				settings={poll.question.data}
				pollUserResults={channelPoll?.answers}
				currentUserId={userId}
				onAnswer={
					mode === "answer"
						? (answerData) => {
								submit(objectToFormData(answerData), {
									method: "POST",
								});
						  }
						: undefined
				}
			/>
		</main>
	);
}
