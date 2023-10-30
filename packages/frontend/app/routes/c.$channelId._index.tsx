// import type { ChannelDTO } from "@marcianosrs/engine";
import { objectToFormMapping } from "@marcianosrs/form";
import { getChannelBySlug, getPolls } from "./api.server";
import { questionTypeStore, scoreProcessorStore } from "@marcianosrs/engine";
import type {
	PollUserResult,
	PollDTO,
	QuestionScoreResult,
} from "@marcianosrs/engine";
import { json } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { throwIfNotAuthorized } from "~/util/isAuthorized";
// import { useOutletContext } from "@remix-run/react";
import { parse } from "qs";

type LoaderData = {
	poll: PollDTO;
};

const getActivePoll = async () => {
	const polls = await getPolls();
	return polls[0];
};

export const loader: LoaderFunction = async ({ request }) => {
	await throwIfNotAuthorized(request);
	const poll = await getActivePoll();
	return json({ poll });
};

export const action: ActionFunction = async ({ request, params }) => {
	const { decodedClaims } = await throwIfNotAuthorized(request);

	const channelId = params.channelId;
	if (channelId === undefined) {
		return null;
	}

	const channel = await getChannelBySlug(channelId);

	const data = await request.text();
	const formData = parse(data);

	const poll = await getActivePoll();
	const pollPlugin = questionTypeStore.get(poll.question.type);
	const earlierQuestionResults: PollUserResult<Record<string, unknown>>[] =
		[]; // <-- This should come from channel-question model, user answers

	const questionResult = pollPlugin.createScoreResult(
		poll.question.data,
		formData,
		earlierQuestionResults
	);

	const scorePluginsActive = (channel.scoreModifiers ?? []).map<string>(
		(m) => m.processor.type
	);

	const processors = (channel.scoreModifiers ?? []).map<
		(score: QuestionScoreResult) => QuestionScoreResult
	>((m) => {
		const processor = scoreProcessorStore.get(m.processor.type);
		return (score: QuestionScoreResult) =>
			processor.processResult(score, m.processor.data);
	});

	const processedScoreResult = processors.reduce(
		(score, processor) => processor(score),
		questionResult
	);

	const newResult: PollUserResult<Record<string, unknown>> = {
		originalScoreResult: questionResult,
		processedScoreResult,
		pollId: poll.id,
		questionId: "Id-of-channel-question-thingie",
		questionResult: formData,
		scorePluginsActive,
		userId: decodedClaims.uid,
	};

	console.log(newResult); // <-- This should be stored in the channel-question model as user answer

	return null;
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
	const { poll } = useLoaderData<LoaderData>();
	// const { channel } = useOutletContext<{ channel: ChannelDTO }>();
	const submit = useSubmit();

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
				onAnswer={(answerData) => {
					submit(objectToFormData(answerData), {
						method: "POST",
					});
				}}
			/>
		</main>
	);
}
