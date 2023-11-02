import {
	CreateChannelDTO,
	ChannelDTO,
	ContentIdentifier,
} from "@marcianosrs/engine";
import { FieldValue, db } from "./firebase";
import { toSlug } from "@marcianosrs/utils";
import { docToDomainObject } from "./document-helpers";

export const createChannel = async (
	newChannel: CreateChannelDTO
): Promise<ChannelDTO> => {
	const slug = toSlug(newChannel.name);
	const channelSnapshot = await db
		.collection("channels")
		.where("slug", "==", slug)
		.get();
	if (!channelSnapshot.empty) {
		throw new Error(`Channel with slug '${slug}' already exists`);
	}

	const createdAt = FieldValue.serverTimestamp();
	const channel = {
		...newChannel,
		slug,
		playlist: [],
		startedAt: null,
		createdAt,
	};

	const result = await db.collection("channels").add(channel);

	const doc = await result.get();
	return docToDomainObject<ChannelDTO>(doc);
};

export const getChannels = async (): Promise<ChannelDTO[]> =>
	db
		.collection("channels")
		.get()
		.then((snapshot) =>
			snapshot.docs.map((doc) => docToDomainObject<ChannelDTO>(doc))
		)
		.catch(() => []);

export const getChannelBySlug = async (slug: string): Promise<ChannelDTO> => {
	const channelSnapshot = await db
		.collection("channels")
		.where("slug", "==", slug)
		.get();
	if (channelSnapshot.empty) {
		throw new Error(`Channel with slug '${slug}' not found`);
	}

	const data = channelSnapshot.docs[0];
	return docToDomainObject<ChannelDTO>(data);
};

export const addPollToChannel = async (
	channelId: ContentIdentifier,
	pollId: ContentIdentifier
) => {
	const channelPoll = {
		pollId,
		channelId,
		openedAt: null,
		closedAt: null,
		answers: [],
	};

	const result = await db.collection("channelPolls").add(channelPoll);

	await db
		.collection("channels")
		.doc(channelId)
		.update({ playlist: FieldValue.arrayUnion(result.id) });
};
