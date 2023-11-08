import type {
	ChannelDTO,
	PluginData,
	PollUserResult,
	QuestionScoreResult,
} from "@marcianosrs/engine";
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

const createProcessorChain = (processorPlugins: PluginData[]) => {
	const processors = processorPlugins.map<
		(score: QuestionScoreResult) => QuestionScoreResult
	>(
		(plugin) => (score: QuestionScoreResult) =>
			scoreProcessorStore
				.get(plugin.type)
				.processResult(score, plugin.data)
	);

	return {
		process: (score: QuestionScoreResult): QuestionScoreResult =>
			processors.reduce((score, processor) => processor(score), score),
	};
};

const updateRankingSystems = async (
	rankingSystems: ChannelDTO["rankingSystems"],
	scoreResult: QuestionScoreResult,
	userId: string
) => {
	for (const ranking of rankingSystems) {
		const { type: pluginType, data: pluginSettings } = ranking.ranking;

		if (!ranking.rankingSystemId) continue;

		const rankingPlugin = rankingSystemStore.get(pluginType);
		if (!rankingPlugin.verifySettings(pluginSettings)) continue;

		const rankingData = await getRankingSystemById(ranking.rankingSystemId);
		const data =
			rankingData?.content ?? rankingPlugin.initializeSystemData();

		const updatedRankingData = rankingPlugin.processResult(
			scoreResult,
			{ id: userId },
			pluginSettings,
			data
		);
		await updateRankingSystem(ranking.rankingSystemId, updatedRankingData);
	}
};

export const answerPollQuestion = async (
	channelSlug: string,
	answerData: AnswerData,
	userId: string
) => {
	const channel = await getChannelBySlug(channelSlug);

	// used for storing and retrieving answers of this question instance
	const channelPollItem =
		channel && (await getOpenPollForChannel(channel.id));

	// contains the question and answer data
	const poll = channelPollItem && (await getPollById(channelPollItem.pollId));
	if (!poll) {
		throw new Error("Poll Question not found");
	}
	const pollPlugin = questionTypeStore.get(poll.question.type);

	// Initial poll result, before further processing
	const questionResult = pollPlugin.createScoreResult(
		poll.question.data,
		answerData,
		channelPollItem.answers
	);

	const processedScoreResult = createProcessorChain(
		channelPollItem.questionScorePluginsActive ?? []
	).process(questionResult);

	const newResult: PollUserResult<Record<string, unknown>> = {
		originalScoreResult: questionResult,
		processedScoreResult,
		questionResult: answerData,
		userScorePluginsActive: [],
		userId,
	};

	// Store user answer into poll question
	createPollResult(channelPollItem.id, newResult);

	await updateRankingSystems(
		channel.rankingSystems,
		processedScoreResult,
		userId
	);
};
