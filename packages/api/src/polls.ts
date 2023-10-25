import { CreatePollDTO, PollDTO } from "@marcianosrs/engine";
import { FieldValue, db } from "./firebase";
import { docToDomainObject } from "./document-helpers";

export const createPoll = async (newPoll: CreatePollDTO): Promise<PollDTO> => {
	const timestamp = FieldValue.serverTimestamp();
	const poll = {
		...newPoll,
		createdAt: timestamp,
	};

	const result = await db.collection("polls").add(poll);

	const doc = await result.get();
	return docToDomainObject<PollDTO>(doc);
};

export const getPolls = async (): Promise<PollDTO[]> =>
	db
		.collection("polls")
		.get()
		.then((snapshot) =>
			snapshot.docs.map((doc) => docToDomainObject<PollDTO>(doc))
		)
		.catch(() => []);
