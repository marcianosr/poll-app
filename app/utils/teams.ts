import { getApp, getApps, initializeApp } from "firebase/app";
import {
	getFirestore,
	doc,
	getDocs,
	collection,
	query,
	setDoc,
} from "firebase/firestore";
import { firebaseConfig } from "~/utils/config.client";
import { DeepPartial } from "./types";

export type Team = {
	id: string;
	users: string[];
	points: {
		streak: number;
		total: number;
	};
	name: string;
};

export type UpdateTeam = Pick<DeepPartial<Team>, "id" | "points">;

export const getTeams = async () => {
	const app =
		getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

	const db = getFirestore(app);

	const ref = collection(db, "teams");
	const getQuery = query(ref);
	const querySnapshot = await getDocs(getQuery);

	return querySnapshot.docs.map((item) => item.data());
};

export const updateTeamById = async <T extends UpdateTeam>(payload: T) => {
	const app =
		getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

	const db = getFirestore(app);

	const snapshot = await setDoc(
		doc(db, "teams", payload.id as string),
		payload,
		{
			merge: true,
		}
	);

	return snapshot;
};
