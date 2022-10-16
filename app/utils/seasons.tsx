import {
	addDoc,
	collection,
	getDocs,
	orderBy,
	query,
} from "firebase/firestore";
import { Award } from "~/components/Awards";
import { PollData, Voted } from "./polls";
import { db } from "~/utils/firebase";

type AwardInput = Pick<Award, "name" | "description">;
export type SeasonAwardData = AwardInput & {
	winner: {
		// ! Refactor to Pick<User>
		id: string;
		displayName: string;
	};
};

export type PollAwardData = {
	id: string;
	voted: Voted[];
	documentId: string;
};
export type SeasonData = {
	awards: SeasonAwardData[];
	polls: PollAwardData[];
	season: number;
	date: number;
};

export async function createSeason(data: SeasonData) {
	await addDoc(collection(db, "seasons"), data);
	console.info("created seasons!");
	// console.log(data);
}

export async function getAllSeasons() {
	const ref = collection(db, "seasons");
	const getQuery = query(ref, orderBy("season", "desc"));
	const querySnapshot = await getDocs(getQuery);

	return querySnapshot.docs.map((item) => item.data());
}
