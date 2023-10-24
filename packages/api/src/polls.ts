import { CreatePollDTO, PollDTO } from "@marcianosrs/engine";
import { FieldValue, db } from "./firebase";

export const createPoll = async (newPoll: CreatePollDTO): Promise<PollDTO> => {
	const timestamp = FieldValue.serverTimestamp();
	const poll = {
		...newPoll,
		createdAt: timestamp,
	};

	const result = await db.collection("polls").add(poll);

	const data = (await result.get()).data() as PollDTO;
	return data;
};

export const getPolls = async (): Promise<PollDTO[]> =>
	db
		.collection("polls")
		.get()
		.then((snapshot) =>
			snapshot.docs.map<PollDTO>(
				(doc) =>
					({
						...doc.data(),
						id: doc.id,
					} as PollDTO)
			)
		)
		.catch(() => []);
