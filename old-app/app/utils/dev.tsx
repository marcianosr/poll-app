import fs from "fs";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "~/utils/firebase";
import { getAllPolls, PollData } from "./polls";
import { getUsers } from "./user";

import mockPolls from "~/fixtures/polls.json";
import mockUsers from "~/fixtures/users.json";
import mockTeams from "~/fixtures/teams.json";
import kabisa from "../fixtures/kabisa.json";

// ! DEVELOPMENT INTENDED DATA POPULATION

export async function createKabisaPolls() {
	// await addDoc(collection(db, "kabisa"), kabisa);
	await setDoc(doc(db, "kabisa", "60y9Z3Nl1HENGoWaN576"), kabisa);
	console.info("created kabisa!");
}

export async function createPollsDev(data: any) {
	await addDoc(collection(db, "polls"), data);
	console.info("created poll!");
}

export async function addUser(data: any) {
	await setDoc(doc(db, "users", data.id), data);
	console.info("created user!");
}

export async function addTeam(data: any) {
	await setDoc(doc(db, "teams", data.id), data);
	console.info("created team!");
}

// ! Bootstrap function used for populating emulator data. Use on /polls page e.g
export const createDevData = async () => {
	const polls = await getAllPolls();
	const users = await getUsers();

	console.log("create dev data");

	// ! only used when connected to PROD
	// writeCurrentProdDataToFile(users, polls, teams);

	if (process.env.NODE_ENV === "development") {
		console.log("create");

		populateFirestoreWithFileData();
	}
};

const writeCurrentProdDataToFile = (users, polls, teams) => {
	console.log("write data...");
	fs.writeFileSync("app/fixtures/polls.json", JSON.stringify(polls));
	fs.writeFileSync("app/fixtures/users.json", JSON.stringify(users));
};

const populateFirestoreWithFileData = () => {
	mockPolls.forEach((poll) => createPollsDev(poll));
	mockUsers.forEach((user) => addUser(user));
};
