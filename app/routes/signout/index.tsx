import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getApp, getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "~/utils/config.client";

import { session } from "../../utils/cookies";
import { LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
	console.log("hi");
	return redirect("/", {
		headers: {
			"Set-Cookie": await session.serialize("", {
				expires: new Date(0),
			}),
		},
	});
};

export default function Signout() {
	const app =
		getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
	const auth = getAuth(app);

	useEffect(() => {
		signOut(auth)
			.then(() => {
				// Sign-out successful.
			})
			.catch((error) => {
				// An error happened.
			});
	}, []);
	return <h1>sign out</h1>;
}
