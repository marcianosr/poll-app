import { getApp, getApps, initializeApp } from "firebase/app";
import {
	getAuth,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	signOut,
	User,
} from "firebase/auth";
import {
	getFirestore,
	doc,
	setDoc,
	connectFirestoreEmulator,
} from "firebase/firestore";
import React, { createContext, useEffect } from "react";
import { firebaseConfig } from "~/utils/config.client";
import { getAdminUser, getUserByID } from "~/utils/user";

type AuthContextState = {
	user: (User & FirebaseUser) | null;
	googleLogin: () => void;
	error: string | null;
	isAdmin: boolean;
};

type AuthProviderProps = {};

export const AuthContext = createContext<AuthContextState>({
	user: null,
	googleLogin: () => {},
	error: null,
	isAdmin: false,
});

export type FirebaseUserFields = {
	id: string;
	displayName: string;
	email: string;
	photoURL: string;
	polls: {
		total: number;
		maxStreak: number;
		currentStreak: number;
		correct: number;
		answeredById: string[];
	};
	pixels: number;
	role: "user" | "admin";
	lastPollSubmit: number;
};

type FirebaseUser = {
	firebase: FirebaseUserFields;
};

export async function addUser(data: FirebaseUserFields) {
	const app =
		getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

	const userExists = await getUserByID(data.id);

	const db = getFirestore(app);

	if (document.location.hostname === "localhost") {
		// Point to the RTDB emulator running on localhost.
		connectFirestoreEmulator(db, "localhost", 8080);
		console.info("Using an emulated database");
	}

	if (userExists) return;

	await setDoc(doc(db, "users", data.id), data);
	console.info("created user!");
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [googleUser, setGoogleUser] = React.useState<User | null>();
	const [user, setUser] = React.useState<(User & FirebaseUser) | null>();
	const [error, setError] = React.useState<string | null>();
	const [isAdmin, setAdmin] = React.useState(false);

	useEffect(() => {
		if (googleUser?.uid) {
			getAdminUser(googleUser?.uid || "").then((result) => {
				return setAdmin(!!result);
			});

			// fetch firebase user data
			getUserByID(googleUser?.uid)
				.then((result) => {
					console.log("res", result);
					return setUser({
						// ! Improve this later: Can we do this a different way?
						...googleUser,
						firebase: {
							id: result?.id,
							displayName: result?.displayName,
							email: result?.email,
							photoURL: result?.photoURL,
							pixels: result?.pixels,
							polls: {
								answeredById: result?.polls.answer,
								correct: result?.polls.correct,
								currentStreak: result?.polls.currentStreak,
								maxStreak: result?.polls.maxStreak,
								total: result?.polls.total,
							},
							role: result?.role,
							lastPollSubmit: result?.lastPollSubmit,
						},
					});
				})
				.catch((error) => console.log("get user by id error:", error));
		}
	}, [googleUser?.uid]);

	const app =
		getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
	const auth = getAuth(app);
	const provider = new GoogleAuthProvider();

	const googleLogin = () => {
		signInWithPopup(auth, provider)
			.then((result) => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				const credential =
					GoogleAuthProvider.credentialFromResult(result);
				const token = credential?.accessToken;
				// The signed-in user info.
				console.log("result", result);

				return addUser({
					id: result.user.uid,
					displayName: result.user.displayName || "",
					email: result.user.email || "",
					photoURL: result.user.photoURL || "",
					polls: {
						total: 0,
						maxStreak: 0,
						currentStreak: 0,
						correct: 0,
						answeredById: [],
					},
					pixels: 0,
					role: "user",
					lastPollSubmit: 0,
				});
				// ...
			})
			.catch((error) => {
				// Handle Errors here.
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(error);
				// The email of the user's account used.
				const email = error.customData.email;
				// The AuthCredential type that was used.
				const credential =
					GoogleAuthProvider.credentialFromError(error);
				// ...

				setError("Sorry, something went wrong");
			});
	};

	// signOut(auth)
	// 	.then(() => {
	// 		// Sign-out successful.
	// 	})
	// 	.catch((error) => {
	// 		// An error happened.
	// 	});

	onAuthStateChanged(auth, (result) => {
		result ? setGoogleUser(result) : setGoogleUser(null);
	});

	return (
		<AuthContext.Provider
			value={{
				user: user || null,
				googleLogin,
				error: error || null,
				isAdmin,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextState => React.useContext(AuthContext);
