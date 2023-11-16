import {
	GoogleAuthProvider,
	signInWithPopup,
	signInWithCredential,
} from "firebase/auth";
import { initFirebaseClient } from "./client";

export const loginAndCreate = async () => {
	const { auth } = initFirebaseClient();

	const provider = new GoogleAuthProvider();
	return signInWithPopup(auth, provider);
};

export const loginForTesting = async () => {
	const { auth } = initFirebaseClient(true);
	return signInWithCredential(
		auth,
		GoogleAuthProvider.credential(
			'{"sub": "abc123", "email": "test-poll-user@example.com", "email_verified": true}'
		)
	);
};
