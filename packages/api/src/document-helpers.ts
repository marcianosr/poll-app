export const docToDomainObject = <T>(
	doc:
		| FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
		| FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
): T =>
	({
		...doc.data(),
		id: doc.id,
	} as T);
