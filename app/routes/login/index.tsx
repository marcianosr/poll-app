import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useAuth } from "~/providers/AuthProvider";
import { auth as serverAuth } from "~/firebase.server";
import { session } from "~/utils/cookies";

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const idToken = form.get("idToken")?.toString();

	console.log("id", idToken);
	if (idToken) {
		await serverAuth.verifyIdToken(idToken);

		const jwt = await serverAuth.createSessionCookie(idToken, {
			// 5 days - can be up to 2 weeks
			expiresIn: 60 * 60 * 24 * 5 * 1000,
		});

		return redirect("/polls", {
			headers: {
				"Set-Cookie": await session.serialize(jwt),
			},
		});
	}
	// console.log("id", idToken);

	return {};
	// // Verify the idToken is actually valid
	// await serverAuth.verifyIdToken(idToken || "");

	// const jwt = await serverAuth.createSessionCookie(idToken || "", {
	// 	// 5 days - can be up to 2 weeks
	// 	expiresIn: 60 * 60 * 24 * 5 * 1000,
	// });

	// console.log("idToken:", idToken);

	// return redirect("/polls", {
	// 	headers: {
	// 		"Set-Cookie": await session.serialize(jwt),
	// 	},
	// });
};

export const loader: LoaderFunction = async ({ params }) => {
	return {};
};

export default function Index() {
	const { user, googleLogin, error } = useAuth();
	return (
		<section
			style={{
				display: "flex",
				justifyContent: "center",
				color: "white",
			}}
		>
			<h1>Login</h1>
			<Form method="post">
				<button onClick={googleLogin}>Login</button>
			</Form>
		</section>
	);
}
