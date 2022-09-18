import fs from "fs";
import { addDoc, collection } from "firebase/firestore";
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

export async function createUsersDev(data: any) {
	await addDoc(collection(db, "users"), data);
	console.info("created user!");
}

// ! Bootstrap function used for populating emulator data
export const createDevData = async () => {
	const polls = await getAllPolls();
	const users = await getUsers();

	console.log("create dev data");

	writeCurrentProdDataToFile(users, polls);

	if (process.env.NODE_ENV === "development") {
		console.log("create");

		populateFirestoreWithFileData();
	}
};

const writeCurrentProdDataToFile = (users, polls) => {
	fs.writeFileSync("./fixtures/polls.json", JSON.stringify(polls));
	fs.writeFileSync("./fixtures/users.json", JSON.stringify(users));
};

const populateFirestoreWithFileData = () => {
	mockPolls.forEach((poll) => createPollsDev(poll));
	mockUsers.forEach((user) => createUsersDev(user));
};
