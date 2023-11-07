import { objectToFormMapping } from "@marcianosrs/form";
import {
	createPollResult,
	getChannelBySlug,
	getOpenPollForChannel,
	getPollById,
	getRankingSystemById,
	updateRankingSystem,
} from "./api.server";
import {
	questionTypeStore,
	rankingSystemStore,
	scoreProcessorStore,
} from "@marcianosrs/engine";
import type {
	PollUserResult,
	PollDTO,
	QuestionScoreResult,
	ChannelPollItemDTO,
} from "@marcianosrs/engine";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useOutletContext, useSubmit } from "@remix-run/react";
import { throwIfNotAuthorized } from "~/util/isAuthorized";
import { parse } from "qs";

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

	const channel = await getChannelBySlug(channelSlug);

	const data = await request.text();
	const formData = parse(data);

	const channelPollItem =
		channel && (await getOpenPollForChannel(channel.id));
	const poll = channelPollItem && (await getPollById(channelPollItem.pollId));
	if (!poll) {
		throw new Error("Poll Question not found");
	}

	const pollPlugin = questionTypeStore.get(poll.question.type);
	const earlierQuestionResults: PollUserResult<Record<string, unknown>>[] =
		channelPollItem.answers;

	const questionResult = pollPlugin.createScoreResult(
		poll.question.data,
		formData,
		earlierQuestionResults
	);

	const processors = (channelPollItem.questionScorePluginsActive ?? []).map<
		(score: QuestionScoreResult) => QuestionScoreResult
	>((m) => {
		const processor = scoreProcessorStore.get(m.type);
		return (score: QuestionScoreResult) =>
			processor.processResult(score, m.data);
	});

	const processedScoreResult = processors.reduce(
		(score, processor) => processor(score),
		questionResult
	);

	const newResult: PollUserResult<Record<string, unknown>> = {
		originalScoreResult: questionResult,
		processedScoreResult,
		questionResult: formData,
		userScorePluginsActive: [],
		userId: decodedClaims.uid,
	};
	createPollResult(channelPollItem.id, newResult);

	for (const ranking of channel.rankingSystems) {
		if (!ranking.rankingSystemId) continue;

		const rankingData = await getRankingSystemById(ranking.rankingSystemId);
		const rankingPlugin = rankingSystemStore.get(ranking.ranking.type);
		if (rankingPlugin.verifySettings(ranking.ranking.data)) {
			const data =
				rankingData?.content ?? rankingPlugin.initializeSystemData();
			const updatedData = rankingPlugin.processResult(
				processedScoreResult,
				{ id: decodedClaims.uid },
				ranking.ranking.data,
				data
			);
			await updateRankingSystem(ranking.rankingSystemId, updatedData);
		}
	}

	return redirect(`/c/${channel.slug}/`);
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
				<p>No Poll question found!</p>{" "}
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
