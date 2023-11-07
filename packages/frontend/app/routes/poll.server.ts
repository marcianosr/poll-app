import type { PollUserResult, QuestionScoreResult } from "@marcianosrs/engine";
import {
	questionTypeStore,
	rankingSystemStore,
	scoreProcessorStore,
} from "@marcianosrs/engine";
import {
	createPollResult,
	getChannelBySlug,
	getOpenPollForChannel,
	getPollById,
	getRankingSystemById,
	updateRankingSystem,
} from "./api.server";

type AnswerData = Record<string, unknown>;

export const answerPollQuestion = async (
	channelSlug: string,
	answerData: AnswerData,
	userId: string
) => {
	const channel = await getChannelBySlug(channelSlug);

	const channelPollItem =
		channel && (await getOpenPollForChannel(channel.id));
	const poll = channelPollItem && (await getPollById(channelPollItem.pollId));
	if (!poll) {
		throw new Error("Poll Question not found");
	}

	const pollPlugin = questionTypeStore.get(poll.question.type);
	const earlierQuestionResults: PollUserResult<AnswerData>[] =
		channelPollItem.answers;

	const questionResult = pollPlugin.createScoreResult(
		poll.question.data,
		answerData,
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
		questionResult: answerData,
		userScorePluginsActive: [],
		userId,
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
				{ id: userId },
				ranking.ranking.data,
				data
			);
			await updateRankingSystem(ranking.rankingSystemId, updatedData);
		}
	}
};
