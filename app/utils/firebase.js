// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import admin from "firebase-admin";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

import { getAuth } from "firebase/auth";

require("dotenv").config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-librariescons
export const firebaseConfig = {
	apiKey: "AIzaSyB1IZ5VoXshTpaEhlQWMJtPf3ysTWRAIwo",
	authDomain: "frontend-poll-15de8.firebaseapp.com",
	projectId: "frontend-poll-15de8",
	storageBucket: "frontend-poll-15de8.appspot.com",
	messagingSenderId: "12140400612",
	appId: "1:12140400612:web:9f6354c7af4be7ab8c01f1",
	measurementId: "G-DMJ5WR26YX",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);

const EMULATORS_STARTED = "EMULATORS_STARTED";
function startEmulators() {
	if (!global[EMULATORS_STARTED]) {
		global[EMULATORS_STARTED] = true;
		connectFirestoreEmulator(db, "localhost", 8080);
		console.log("connected to emulator");
	}
}

if (process.env.NODE_ENV === "development") {
	console.log("started");
	startEmulators();
}

export { db, auth };
