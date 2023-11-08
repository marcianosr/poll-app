import { ContentIdentifier, TimestampDTO } from "@marcianosrs/engine";
import { db } from "./firebase";

export const docToDomainObject = <T>(
	doc:
		| FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
		| FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
): T =>
	({
		...doc.data(),
		id: doc.id,
	} as T);

export const getDocumentById = async <T>(
	collection: string,
	id: ContentIdentifier
): Promise<T | null> => {
	const data = await db.collection(collection).doc(id).get();
	return docToDomainObject<T>(data);
};

export type ReplaceTimestamp<TRecord extends Record<string, unknown>> = {
	[Key in keyof TRecord]: TRecord[Key] extends TimestampDTO
		? FirebaseFirestore.FieldValue
		: Extract<TRecord[Key], TimestampDTO> extends TimestampDTO
		? Exclude<TRecord[Key], TimestampDTO> | FirebaseFirestore.FieldValue
		: TRecord[Key];
};
