import { initializeApp, FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { firebaseConfig } from "../../../firebaseConfig";

let app: FirebaseApp;

export const initFirebaseClient = (useEmulator = false) => {
	if (!app) {
		app = initializeApp(firebaseConfig);
	}

	const auth = getAuth(app);
	if (useEmulator) {
		connectAuthEmulator(auth, "http://127.0.0.1:9099");
		console.log("initiated firebase emulator client");
	} else {
		console.log("initiated firebase client");
	}

	return { auth };
};
