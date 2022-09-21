import fs from "fs";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "~/utils/firebase";
import { getAllPolls, PollData } from "./polls";
import { getUsers } from "./user";

import mockPolls from "~/fixtures/polls.json";
import mockUsers from "~/fixtures/users.json";

// ! DEVELOPMENT INTENDED DATA POPULATION

export async function createPollsDev(data: any) {
	await addDoc(collection(db, "polls"), data);
	console.info("created poll!");
}

export async function addUser(data: any) {
	await setDoc(doc(db, "users", data.id), data);
	console.info("created user!");
}

// ! Bootstrap function used for populating emulator data. Use on /polls page e.g
export const createDevData = async () => {
	const polls = await getAllPolls();
	const users = await getUsers();

	console.log("create dev data");

	// ! only used when connected to PROD
	writeCurrentProdDataToFile(users, polls);

	if (process.env.NODE_ENV === "development") {
		console.log("create");

		populateFirestoreWithFileData();
	}
};

const writeCurrentProdDataToFile = (users, polls) => {
	fs.writeFileSync("~/app/fixtures/polls.json", JSON.stringify(polls));
	// fs.writeFileSync("~/app/fixtures/users.json", JSON.stringify(users));
};

const populateFirestoreWithFileData = () => {
	mockPolls.forEach((poll) => createPollsDev(poll));
	mockUsers.forEach((user) => addUser(user));
};
