import { getApp, getApps, initializeApp } from "firebase/app";
import {
	getDoc,
	getFirestore,
	doc,
	getDocs,
	where,
	collection,
	query,
} from "firebase/firestore";
import { firebaseConfig } from "~/utils/config.client";
import { db as serverDb } from "~/utils/firebase";

export const getUserByID = async (id: string) => {
	const app =
		getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

	const db = getFirestore(app);
	const docRef = await doc(db, "users", id);
	const snapshot = await getDoc(docRef);

	if (!snapshot.exists) {
		throw new Error("User doesn't exist");
	} else {
		return snapshot.data();
	}
};

export const getAdminUser = async () => {
	const userRef = collection(serverDb, "users");
	const getQuery = query(userRef, where("role", "==", "admin"));

	const result = await getDocs(getQuery);
	return result.docs.map((item) => item.data());
};
