// import { db } from "./firebase.client";
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	setDoc,
} from "firebase/firestore";

export type InputTypes = "radio" | "checkbox";
export type PollData = {
	id: string;
	question: string;
	answers: {
		id: string;
		value: string;
	}[];
	correctAnswers: string[];
	pollNumber: number | null;
	type: InputTypes | string;
};

const db = getFirestore();

export async function getAmountOfPolls() {
	const ids = await (await getDocs(collection(db, "polls"))).size;

	return ids;
}

export async function createPoll(data: PollData) {
	await addDoc(collection(db, "polls"), data);
	console.info("created poll!");
}

export async function getAllPolls() {
	const querySnapshot = await getDocs(collection(db, "polls"));

	return querySnapshot.docs.map((item) => item.data());
}

export const getDocumentPollIds = async () => {
	const ids = await getDocs(collection(db, "polls"));

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

export const updatePollById = async (id: string, payload: any) => {
	const snapshot = await setDoc(doc(db, "polls", id), payload);

	return snapshot;
};
