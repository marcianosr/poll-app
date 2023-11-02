import { ContentIdentifier } from "@marcianosrs/engine";
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
): T => {
	const itemSnapshot = await db
		.collection(collection)
		.where("id", "==", id)
		.get();
	if (itemSnapshot.empty) {
		throw new Error(`Item from ${collection} with id ${id} not found`);
	}

	const data = itemSnapshot.docs[0];
	return docToDomainObject<T>(data);
};
