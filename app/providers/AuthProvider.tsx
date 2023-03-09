import { getApp, getApps, initializeApp } from "firebase/app";
import {
	getAuth,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	signOut,
	User,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import React, { createContext, useEffect } from "react";
import { firebaseConfig } from "~/utils/config.client";
import { getAdminUser, getUserByEmail } from "~/utils/user";

export type PollAppUser = User & FirebaseUser;
type AuthContextState = {
	user: PollAppUser | null;
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
		seasonStreak: number;
		correct: number;
		answeredById: string[];
	};
	role: "user" | "admin";
	lastPollSubmit: number;
};

type FirebaseUser = {
	firebase: FirebaseUserFields;
};

export async function addUser(data: FirebaseUserFields) {
	console.log("data", data);
	const app =
		getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

	const userExists = await getUserByEmail(data.email);

	const db = getFirestore(app);

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
		if (googleUser?.email) {
			getAdminUser(googleUser?.email || "").then((result) => {
				return setAdmin(result);
			});

			// fetch firebase user data
			getUserByEmail(googleUser?.email).then((result) => {
				return setUser({
					// ! Improve this later: Can we do this a different way?
					...googleUser,
					firebase: {
						id: result?.id,
						displayName: result?.displayName,
						email: result?.email,
						photoURL: result?.photoURL,
						polls: {
							answeredById: result?.polls.answer,
							correct: result?.polls.correct,
							currentStreak: result?.polls.currentStreak,
							seasonStreak: result?.polls.seasonStreak,
							maxStreak: result?.polls.maxStreak,
							total: result?.polls.total,
						},
						role: result?.role,
						lastPollSubmit: result?.lastPollSubmit,
					},
				});
			});
		}
	}, [googleUser?.email]);

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
						seasonStreak: 0,
						correct: 0,
						answeredById: [],
					},
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
