import { getApp, getApps, initializeApp } from "firebase/app";
import {
	getAuth,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	User,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { firebaseConfig } from "~/utils/config.client";
import { getUserByEmail } from "~/utils/user";

export type UserRole = "user" | "admin";
export type FirebaseUserFields = {
	id: string;
	displayName: string;
	email: string;
	photoURL: string;
	polls: {
		total: number;
		maxStreak: number;
		currentStreak: number;
		seasonStreak: number;
		correct: number;
		answeredById: string[];
	};
	role: UserRole;
	lastPollSubmit: number;
};

export type FirebaseUser = {
	firebase: FirebaseUserFields;
};

export type PollAppUser = User & FirebaseUser;

export async function addUser(data: FirebaseUserFields) {
	const app =
		getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

	await getUserByEmail(data.email).catch((err) => {
		const db = getFirestore(app);
		setDoc(doc(db, "users", data.id), data);
		console.info("created user!");
	});
}

export const loginOrCreate = async (): Promise<PollAppUser> => {
	const app =
		getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

	const auth = getAuth(app);
	const provider = new GoogleAuthProvider();

	const result = await signInWithPopup(auth, provider);

	const firebaseUserFields: FirebaseUserFields = {
		id: result.user.uid,
		displayName: result.user.displayName || "",
		email: result.user.email || "",
		photoURL: result.user.photoURL || "",
		polls: {
			total: 0,
			maxStreak: 0,
			currentStreak: 0,
			seasonStreak: 0,
			correct: 0,
			answeredById: [],
		},
		role: "user",
		lastPollSubmit: 0,
	};

	await addUser(firebaseUserFields);

	const user = await getPollAppUser();

	if (!user) throw new Error("Error logging in");

	return user;
};

export const getPollAppUser = async (): Promise<PollAppUser | null> => {
	const app =
		getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

	const auth = getAuth(app);
	const user = await new Promise<User>((resolve) => {
		onAuthStateChanged(auth, (user) => user && resolve(user));
	});

	if (!user || !user.email) return null;

	return getUserByEmail(user.email).then((result) => {
		if (!result) return null;
		return {
			...user,
			...result,
		};
	});
};

export const logout = async (): Promise<void> => {
	const app =
		getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
	const auth = getAuth(app);
	await auth.signOut();
};
