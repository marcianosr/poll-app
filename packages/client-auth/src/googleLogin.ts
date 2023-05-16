import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initFirebaseClient } from "./client";

export const loginAndCreate = async () => {
	const { auth } = initFirebaseClient();

	const provider = new GoogleAuthProvider();
	const result = signInWithPopup(auth, provider);

	return result;
};
