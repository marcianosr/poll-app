// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import admin from "firebase-admin";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

import { getAuth, inMemoryPersistence, setPersistence } from "firebase/auth";

require("dotenv").config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-librariescons
const firebaseConfig = {
	apiKey: "AIzaSyA73pnN6GcTHTFhjaEuxK0svl9TChiSDUU",
	authDomain: "polls-d8b3d.firebaseapp.com",
	projectId: "polls-d8b3d",
	storageBucket: "polls-d8b3d.appspot.com",
	messagingSenderId: "994177718093",
	appId: "1:994177718093:web:58608f76ee43b40c790904",
	measurementId: "G-3W6P31RECN",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);

setPersistence(auth, inMemoryPersistence);

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
