// Import the functions you need from the SDKs you need
import { Firestore, getFirestore } from "firebase-admin/firestore";

import {
	initializeApp,
	applicationDefault,
	getApps,
	getApp,
} from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";

require("dotenv").config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-librariescons

const initServerFirebase = () => {
	let app;
	let auth: Auth;
	let db: Firestore;

	if (process.env.NODE_ENV === "development") {
		console.log("Development");
		app =
			getApps().length === 0
				? initializeApp({
						// projectId: "demo-polls-d8b3d",
						credential: applicationDefault(),
				  })
				: getApp();
		auth = getAuth();
		db = getFirestore();
	} else {
		console.log("PRd");
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
