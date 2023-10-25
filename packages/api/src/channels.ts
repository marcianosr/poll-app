import { CreateChannelDTO, ChannelDTO } from "@marcianosrs/engine";
import { FieldValue, db } from "./firebase";
import { toSlug } from "@marcianosrs/utils";

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
		createdAt,
	};

	const result = await db.collection("channels").add(channel);

	const data = (await result.get()).data() as ChannelDTO;
	return data;
};

export const getChannels = async (): Promise<ChannelDTO[]> =>
	db
		.collection("channels")
		.get()
		.then((snapshot) =>
			snapshot.docs.map<ChannelDTO>(
				(doc) =>
					({
						...doc.data(),
						id: doc.id,
					} as ChannelDTO)
			)
		)
		.catch(() => []);
