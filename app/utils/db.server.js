// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import admin from "firebase-admin";
import {
	applicationDefault,
	initializeApp as initializeAdminApp,
} from "firebase-admin/app";

require("dotenv").config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyB1IZ5VoXshTpaEhlQWMJtPf3ysTWRAIwo",
	authDomain: "frontend-poll-15de8.firebaseapp.com",
	projectId: "frontend-poll-15de8",
	storageBucket: "frontend-poll-15de8.appspot.com",
	messagingSenderId: "12140400612",
	appId: "1:12140400612:web:9f6354c7af4be7ab8c01f1",
	measurementId: "G-DMJ5WR26YX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

if (!admin.apps.length) {
	initializeAdminApp({
		credentials: applicationDefault(),
		databaseURL: "https://frontend-poll-15de8.firebaseapp.com",
		// databaseURL: "https://frontend-poll-15de8.firebaseio.com",
	});
}

const db = admin.firestore();
let firebase;

if (!firebase?.apps?.length) {
	firebase = initializeApp(firebaseConfig);
}

export { db };
