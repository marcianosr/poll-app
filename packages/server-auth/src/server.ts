// Import the functions you need from the SDKs you need
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import {
	initializeApp,
	getApps,
	getApp,
	AppOptions,
	applicationDefault,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { firebaseConfig } from "../../../firebaseConfig";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-librariescons

const initServerFirebase = (useCredential = true) => {
	const configToUse: AppOptions = useCredential
		? firebaseConfig
		: { credential: applicationDefault() };
	const app = getApps().length === 0 ? initializeApp(configToUse) : getApp();
	const auth = getAuth(app);
	const db = getFirestore();

	return { app, auth, db, FieldValue };
};

export type {
	DocumentData,
	DocumentReference,
	QuerySnapshot,
} from "firebase-admin/firestore";
export { initServerFirebase };
