import {
	CreateChannelDTO,
	ChannelDTO,
	ContentIdentifier,
	CreateChannelPollItemDTO,
	PluginData,
	ChannelPollItemDTO,
} from "@marcianosrs/engine";
import { FieldValue, db } from "./firebase";
import { toSlug } from "@marcianosrs/utils";
import { docToDomainObject, getDocumentById } from "./document-helpers";
import { CHANNELS, CHANNEL_POLLS } from "./collection-consts";
import { createRankingSystem } from "./rankingSystems";

export const createChannel = async (
	newChannel: CreateChannelDTO
): Promise<ChannelDTO> => {
	const slug = toSlug(newChannel.name);
	const channelSnapshot = await db
		.collection(CHANNELS)
		.where("slug", "==", slug)
		.get();
	if (!channelSnapshot.empty) {
		throw new Error(`Channel with slug '${slug}' already exists`);
	}

	const createdAt = FieldValue.serverTimestamp();

	const rankingSystems: ChannelDTO["rankingSystems"] = [];
	for (const rankingSystem of newChannel.rankingSystems) {
		if (rankingSystem.rankingSystemId === undefined) {
			const rankingSystemId = await createRankingSystem();
			rankingSystems.push({ ...rankingSystem, rankingSystemId });
		} else {
			rankingSystems.push(rankingSystem);
		}
	}

	const channel = {
		...newChannel,
		rankingSystems,
		slug,
		queue: [],
		startedAt: null,
		createdAt,
	};

	const result = await db.collection(CHANNELS).add(channel);

	const doc = await result.get();
	return docToDomainObject<ChannelDTO>(doc);
};

export const getChannels = async (): Promise<ChannelDTO[]> =>
	db
		.collection(CHANNELS)
		.get()
		.then((snapshot) =>
			snapshot.docs.map((doc) => docToDomainObject<ChannelDTO>(doc))
		)
		.catch(() => []);

export const getChannelBySlug = async (
	slug: string
): Promise<ChannelDTO | null> => {
	const channelSnapshot = await db
		.collection(CHANNELS)
		.where("slug", "==", slug)
		.get();
	if (channelSnapshot.empty) {
		return null;
	}

	const data = channelSnapshot.docs[0];
	return docToDomainObject<ChannelDTO>(data);
};

export const addPollToChannel = async (
	channelId: ContentIdentifier,
	pollId: ContentIdentifier
) => {
	const channelPoll: CreateChannelPollItemDTO = {
		pollId,
		channelId,
		openedAt: null,
		closedAt: null,
		answers: [],
		questionScorePluginsActive: [],
	};

	const result = await db.collection(CHANNEL_POLLS).add(channelPoll);

	await db
		.collection(CHANNELS)
		.doc(channelId)
		.update({ queue: FieldValue.arrayUnion(result.id) });
};

const isIdentifier = <T>(
	arg: ContentIdentifier | T
): arg is ContentIdentifier => typeof arg === "string";

export const openNextPoll = async (
	channel: ContentIdentifier | ChannelDTO,
	activeScorePlugins: PluginData[]
) => {
	const channelObj = isIdentifier(channel)
		? await getDocumentById<ChannelDTO>(CHANNELS, channel)
		: channel;
	const firstInQueue = channelObj?.queue[0];
	if (!firstInQueue) return;

	await db.collection(CHANNEL_POLLS).doc(firstInQueue).update({
		openedAt: FieldValue.serverTimestamp(),
		questionScorePluginsActive: activeScorePlugins,
	});
};

export const closeCurrentPoll = async (
	channel: ContentIdentifier | ChannelDTO
) => {
	const channelObj = isIdentifier(channel)
		? await getDocumentById<ChannelDTO>(CHANNELS, channel)
		: channel;
	const firstInQueue = channelObj?.queue[0];
	if (!firstInQueue) return;

	await db.collection(CHANNEL_POLLS).doc(firstInQueue).update({
		closedAt: FieldValue.serverTimestamp(),
	});
	await db
		.collection(CHANNELS)
		.doc(channelObj.id)
		.update({
			queue: FieldValue.arrayRemove(firstInQueue),
		});
};

export const getOpenPollForChannel = async (
	channelId: ContentIdentifier
): Promise<ChannelPollItemDTO | null> => {
	const channelPollSnapshot = await db
		.collection(CHANNEL_POLLS)
		.where("openedAt", "!=", null)
		.where("closedAt", "==", null)
		.where("channelId", "==", channelId)
		.get();
	if (channelPollSnapshot.empty) {
		return null;
	}

	const data = channelPollSnapshot.docs[0];
	return docToDomainObject<ChannelPollItemDTO>(data);
};
