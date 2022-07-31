import { db } from "./db.server";

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

export async function getAmountOfPolls() {
	const snapshot = await db.collection("polls").get();

	return snapshot.size;
}

export async function createPoll(data: PollData) {
	const doc = db.collection("polls");
	doc.add({ ...data });
	console.info("created poll!");
}

export async function getAllPolls() {
	const snapshot = await db.collection("polls").get();

	return snapshot.docs.map((item) => item.data());
}

export const getDocumentPollIds = async () => {
	const ids = await (
		await db.collection("polls").listDocuments()
	).map((doc) => doc.id);

	console.log("d ids", ids);
	return ids;
};

export const getPollById = async (id: string) => {
	const snapshot = await db.collection("polls").doc(id).get();

	if (!snapshot.exists) {
		throw new Error("Snapshot doesn't exist");
	} else {
		return snapshot.data();
	}
};

export const updatePollById = async (
	id: string,
	payload: Partial<PollData>
) => {
	const snapshot = await db.collection("polls").doc(id).update(payload);

	return snapshot;
};
