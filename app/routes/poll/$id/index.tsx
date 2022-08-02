import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { collection, getDoc, doc } from "firebase/firestore";
import { getPollById } from "~/utils/polls";
import {
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
} from "firebase/auth";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "~/utils/config.client";
import { useState } from "react";

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export const action: ActionFunction = async ({ request }) => {
	console.log("action");
};
export const loader: LoaderFunction = async ({ params }) => {
	const data = await getPollById(params.id || "");

	return { poll: data };
};

export async function getPoll(id: string) {
	console.log("id", id);
	const snapshot = await getDoc(doc(db, "polls", id));

	if (!snapshot.exists) {
		throw Error("no doc exists");
	} else {
		return snapshot.data();
	}
}

export default function PollDetail() {
	const { poll } = useLoaderData();
	const [user, setUser] = useState<User | null>();

	console.log(user, "user");

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
			});
	};

	onAuthStateChanged(auth, (result) => {
		result ? setUser(result) : setUser(null);
	});

	return (
		<section>
			<button onClick={googleLogin}>Login</button>
			<h1>Poll #{poll.pollNumber}</h1>
			<>
				<h3>{poll.question}</h3>
				<ul>
					{poll.answers.map((answer: any, idx: number) => (
						<li key={idx}>
							<input
								type={poll.type}
								id={idx.toString()}
								name="answer"
							/>
							<label htmlFor={idx.toString()}>
								{answer.value}
							</label>
						</li>
					))}
				</ul>
			</>
		</section>
	);
}
