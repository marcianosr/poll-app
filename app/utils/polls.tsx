// import { db } from "./firebase.client";
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
import { BlockType } from "~/admin/components/PollForm";
import { db } from "~/utils/firebase";
import { PollCategory } from "./categories";

export type InputTypes = "radio" | "checkbox";
export type PollStatus = "open" | "closed" | "new" | "needs-revision";
export type Answer = {
	id: string;
	value: string;
	blockType?: BlockType;
	explanation: Explanation | null;
	points: number;
};

export type Explanation = {
	value: string;
};
export type Voted = {
	answerId: string;
	userId: string;
};

export type CorrectAnswers = {
	id: string;
	value: string;
};
export type PollData = {
	id: string;
	question: string;
	answers: Answer[];
	correctAnswers: CorrectAnswers[];
	pollNumber: number | null;
	type: InputTypes | string;
	status: PollStatus;
	voted: Voted[];
	category: PollCategory;
	codeBlock: string;
	codeSandboxExample: string;
	sentInByUser?: {
		id: string;
		displayName: string;
	} | null;
	openingTime?: number | null;
	documentId?: string;
};

export async function getPollsByOpeningTime() {
	const ref = collection(db, "polls");
	const getQuery = query(ref, orderBy("openingTime", "asc"));
	const querySnapshot = await getDocs(getQuery);

	return querySnapshot.docs
		.map((item) => item.data())
		.filter((poll) => poll.openingTime);
}

export async function getAmountOfClosedPolls() {
	const ref = collection(db, "polls");
	const getQuery = query(ref, where("status", "==", "closed"));

	const ids = await getDocs(getQuery);

	return ids.size;
}

export async function getAmountOfPolls() {
	const ids = await (await getDocs(collection(db, "polls"))).size;

	return ids;
}

export async function createPoll(data: PollData) {
	await addDoc(collection(db, "polls"), data);
	console.info("created poll!");
}

export async function getAllPolls() {
	const ref = collection(db, "polls");
	const getQuery = query(ref, orderBy("pollNumber", "desc"));
	const querySnapshot = await getDocs(getQuery);

	return querySnapshot.docs.map((item) => item.data());
}

export const getDocumentPollIds = async () => {
	const ref = collection(db, "polls");
	const getQuery = query(ref, orderBy("pollNumber", "desc"));

	const ids = await getDocs(getQuery);

	return ids.docs.map((item) => item.id);
};

export const getPollById = async (id: string) => {
	const docRef = await doc(db, "polls", id);
	const snapshot = await getDoc(docRef);

	if (!snapshot.exists) {
		throw new Error("Snapshot doesn't exist");
	} else {
		return snapshot.data();
	}
};

export const updatePollById = async (
	id: string,
	payload: any,
	merge = true
) => {
	const snapshot = await setDoc(doc(db, "polls", id), payload, {
		merge,
	});

	return snapshot;
};

export const resetVotesForPoll = async (id: string) => {
	const snapshot = await setDoc(
		doc(db, "polls", id),
		{ voted: [] },
		{
			merge: true,
		}
	);

	return snapshot;
};

export async function getAllPollsWithIds() {
	const ref = collection(db, "polls");
	const getQuery = query(ref, orderBy("pollNumber", "desc"));
	const querySnapshot = await getDocs(getQuery);

	return querySnapshot.docs.map((item) => ({
		...item.data(),
		documentId: item.id,
	}));
}

export async function getOpenPoll() {
	const ref = collection(db, "polls");
	const getQuery = query(ref, where("status", "==", "open"));

	const snapshots = await getDocs(getQuery);

	return snapshots.docs.map((snapshot) => {
		if (!snapshot.exists) return [];

		return snapshot.data();
	});
}
