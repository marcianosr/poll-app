import { ContentIdentifier, CreatePollDTO, PollDTO } from "@marcianosrs/engine";
import { FieldValue, db } from "./firebase";
import { docToDomainObject, getDocumentById } from "./document-helpers";
import { POLLS } from "./collection-consts";

export const createPoll = async (newPoll: CreatePollDTO): Promise<PollDTO> => {
	const timestamp = FieldValue.serverTimestamp();
	const poll = {
		...newPoll,
		createdAt: timestamp,
	};

	const result = await db.collection(POLLS).add(poll);

	const doc = await result.get();
	return docToDomainObject<PollDTO>(doc);
};

export const getPolls = async (): Promise<PollDTO[]> =>
	db
		.collection(POLLS)
		.get()
		.then((snapshot) =>
			snapshot.docs.map((doc) => docToDomainObject<PollDTO>(doc))
		)
		.catch(() => []);

export const getPollById = (id: ContentIdentifier): Promise<PollDTO | null> =>
	getDocumentById<PollDTO>(POLLS, id);
