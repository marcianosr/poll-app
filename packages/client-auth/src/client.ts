import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseConfig } from "../../../firebaseConfig";

export const initFirebaseClient = () => {
	const app =
		getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

	const auth = getAuth(app);

	return { auth };
};

export const loginAndCreate = async () => {
	const { auth } = initFirebaseClient();

	const provider = new GoogleAuthProvider();
	const result = signInWithPopup(auth, provider);

	return result;
};
