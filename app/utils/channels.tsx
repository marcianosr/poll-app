import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	setDoc,
	query,
	orderBy,
	where,
} from "firebase/firestore";
import { db } from "~/utils/firebase";
import { PollData, PollStatus, Voted } from "./polls";

export type Channel = {
	name: string;
	pollQueue: PollData[];
	participantsIds: string[];
	moderatorsIds: string[];
	documentId?: string;
};

export type ChannelPollStatus = Extract<PollStatus, "open" | "closed">;

// Refactor later to a single Channel type.
// This is mandaroty for now because when creating a channel, the full poll data will be used to create the pollQueue
// But when getting a channel, only the poll ids will be used
export type FirebaseChannel = Pick<
	Channel,
	"name" | "participantsIds" | "documentId"
> & {
	pollQueue: {
		documentId: string;
		status: ChannelPollStatus;
		voted: Voted[];
		openingTime: number | null;
	}[];
	moderatorsIds: string[];
};

export async function createChannel(data: FirebaseChannel) {
	const newChannelRef = await addDoc(collection(db, "channels"), data);

	console.info("created channel!", newChannelRef.id);
	return { id: newChannelRef.id };
}

export const getChannelById = async (id: string) => {
	const docRef = await doc(db, "channels", id);
	const snapshot = await getDoc(docRef);

	if (!snapshot.exists) {
		throw new Error("Snapshot doesn't exist");
	} else {
		return snapshot.data();
	}
};

export const getChannelByName = async (
	name: string
): Promise<Channel | null> => {
	const ref = await collection(db, "channels");
	const getQuery = query(ref, where("name", "==", name));

	const querySnapshot = await getDocs(getQuery);

	if (querySnapshot.empty) {
		return null;
	}

	return {
		...querySnapshot.docs[0].data(),
		documentId: querySnapshot.docs[0].id,
	} as Channel;
};

export const updateChannelById = async (
	id: string,
	payload: any,
	merge = true
) => {
	const snapshot = await setDoc(doc(db, "channels", id), payload, {
		merge,
	});

	return snapshot;
};

export async function getAllChannelsWithIds() {
	const ref = collection(db, "channels");
	const getQuery = query(ref, orderBy("pollNumber", "desc"));
	const querySnapshot = await getDocs(getQuery);

	return querySnapshot.docs.map((item) => ({
		...item.data(),
		documentId: item.id,
	}));
}

export const addUserToChannel = async (channelId: string, userId: string) => {
	const channel = (await getChannelById(channelId)) as Channel;
	const newChannel = {
		...channel,
		participantsIds: [...channel.participantsIds, userId],
	};
	await updateChannelById(channelId, newChannel);
};
