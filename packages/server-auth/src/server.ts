// Import the functions you need from the SDKs you need
import { Firestore, getFirestore } from "firebase-admin/firestore";

import {
	initializeApp,
	applicationDefault,
	getApps,
	getApp,
} from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";
import { firebaseConfig } from "../../../firebaseConfig";

require("dotenv").config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-librariescons

const initServerFirebase = () => {
	let app;
	let auth: Auth;
	let db: Firestore;

	if (process.env.NODE_ENV === "development") {
		console.log("Development zone 🚧");
		app =
			getApps().length === 0
				? initializeApp({
						credential: applicationDefault(),
				  })
				: getApp();
		auth = getAuth();
		db = getFirestore();
	} else {
		console.log("Production zone ⛔️");
		app =
			getApps().length === 0
				? initializeApp({
						credential: applicationDefault(),
				  })
				: getApp();
		auth = getAuth();
		db = getFirestore();
	}

	return { app, auth, db };
};

export { initServerFirebase };
