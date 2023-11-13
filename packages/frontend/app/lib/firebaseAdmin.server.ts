import { initServerFirebase } from "@marcianosrs/server-auth";

require("dotenv").config({
	path: `../../.env`,
});

if (process.env.ENVIRONMENT === "test") {
	console.log("Test zone 🔬");
	console.log("Auth server: ", process.env.FIREBASE_AUTH_EMULATOR_HOST);
	console.log("Firestore: ", process.env.FIRESTORE_EMULATOR_HOST);
} else if (process.env.ENVIRONMENT === "development") {
	console.log("Development zone 🚧");
	console.log("Auth server: ", process.env.FIREBASE_AUTH_EMULATOR_HOST);
	console.log("Firestore: ", process.env.FIRESTORE_EMULATOR_HOST);
} else {
	console.log("Production zone ⛔️");
}

export const { auth, app, db } = initServerFirebase(
	!!process.env.FIREBASE_AUTH_EMULATOR_HOST
);
