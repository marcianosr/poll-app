import { getApp, getApps, initializeApp } from "firebase/app";
import {
	getDoc,
	getFirestore,
	doc,
	getDocs,
	where,
	collection,
	query,
	setDoc,
} from "firebase/firestore";
import { FirebaseUser, FirebaseUserFields } from "~/logic/auth";
import { UpdateScore } from "~/routes/polls/$id";
import { firebaseConfig } from "~/utils/config.client";

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

export const getUserByEmail = async (email: string): Promise<FirebaseUser> => {
	const app =
		getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

	const db = getFirestore(app);

	const ref = collection(db, "users");
	const getQuery = query(ref, where("email", "==", email));

	const users = await getDocs(getQuery);

	if (users.docs.length === 0) {
		console.info(`${email} is not found as user.`);
		throw new Error("User not found");
	}

	return { firebase: users.docs[0].data() as FirebaseUserFields };
};

export const getUsers = async () => {
	const app =
		getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

	const db = getFirestore(app);

	const ref = collection(db, "users");
	const getQuery = query(ref);
	const querySnapshot = await getDocs(getQuery);

	return querySnapshot.docs.map((item) => item.data());
};

export const updateUserById = async <T extends UpdateScore>(payload: T) => {
	const app =
		getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

	const db = getFirestore(app);

	const snapshot = await setDoc(
		doc(db, "users", payload.id as string),
		payload,
		{
			merge: true,
		}
	);

	return snapshot;
};

export const getAdminUser = async (email: string) => {
	const app =
		getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

	const db = getFirestore(app);

	const ref = collection(db, "users");
	const getQueryAdminUser = query(ref, where("role", "==", "admin"));

	const querySnapshot = await getDocs(getQueryAdminUser);

	return querySnapshot.docs.map((item) => {
		return item.data().email === email;
	})[0];
};

export const resetSeasonStreak = async (id: string) => {
	const app =
		getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

	const db = getFirestore(app);
	console.log("season update");

	const snapshot = await setDoc(
		doc(db, "users", id),
		{
			polls: {
				seasonStreak: 0,
			},
		},
		{
			merge: true,
		}
	);

	return snapshot;
};
