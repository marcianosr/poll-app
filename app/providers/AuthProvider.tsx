import { getApp, getApps, initializeApp } from "firebase/app";
import {
	getAuth,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	User,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import React, { createContext } from "react";
import { firebaseConfig } from "~/utils/config.client";
import { getUserByID } from "~/utils/user";

type AuthContextState = {
	user: User | null;
	googleLogin: () => void;
	error: string | null;
};

type AuthProviderProps = {};

export const AuthContext = createContext<AuthContextState>({
	user: null,
	googleLogin: () => {},
	error: null,
});

type UserData = {
	id: string;
	displayName: string;
	email: string;
	photoURL: string;
	streak: number;
	pollsAnswered: number;
	correctPollsAnswered: number;
	pixels: number;
	role: "user" | "admin";
};

export async function addUser(data: UserData) {
	const app =
		getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

	const userExists = await getUserByID(data.id);

	const db = getFirestore(app);

	if (userExists) return;

	await setDoc(doc(db, "users", data.id), data);
	console.info("created user!");
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = React.useState<User | null>();
	const [error, setError] = React.useState<string | null>();

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
				const user = result.user;
				console.log("result", result);

				return addUser({
					displayName: result.user.displayName || "",
					email: result.user.email || "",
					id: result.user.uid,
					photoURL: result.user.photoURL || "",
					streak: 0,
					pollsAnswered: 0,
					correctPollsAnswered: 0,
					pixels: 0,
					role: "user",
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

	onAuthStateChanged(auth, (result) => {
		result ? setUser(result) : setUser(null);
	});

	return (
		<AuthContext.Provider
			value={{
				user: user || null,
				googleLogin,
				error: error || null,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextState => React.useContext(AuthContext);
