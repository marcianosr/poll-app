import { ContentIdentifier, RankingSystemDTO } from "@marcianosrs/engine";
import { FieldValue, db } from "./firebase";
import { RANKING_SYSTEMS } from "./collection-consts";
import { getDocumentById } from "./document-helpers";

export const createRankingSystem = async (): Promise<ContentIdentifier> => {
	const newRankingSystem: Omit<RankingSystemDTO, "id" | "startedAt"> & {
		startedAt: FirebaseFirestore.FieldValue;
	} = {
		startedAt: FieldValue.serverTimestamp(),
		closedAt: null,
		content: null,
	};

	const doc = await db.collection(RANKING_SYSTEMS).add(newRankingSystem);
	return doc.id;
};

export const getRankingSystemById = (id: ContentIdentifier) =>
	getDocumentById<RankingSystemDTO>(RANKING_SYSTEMS, id);

export const updateRankingSystem = (id: ContentIdentifier, data: unknown) =>
	db.collection(RANKING_SYSTEMS).doc(id).update({ data });
