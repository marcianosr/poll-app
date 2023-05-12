import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "../../../firebaseConfig";

let app: FirebaseApp;

export const initFirebaseClient = () => {
	if (!app) {
		app = initializeApp(firebaseConfig);
	}

	const auth = getAuth(app);

	console.log("initiated firebase client");

	return { auth };
};
