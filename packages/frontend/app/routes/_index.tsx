import type {
	ActionFunction,
	LoaderFunction,
	V2_MetaFunction,
} from "@remix-run/node";
import { Title } from "@marcianosrs/ui";
import { useLoaderData, useSubmit } from "@remix-run/react";

import { loginAndCreate } from "@marcianosrs/client-auth";
import {
	isSessionValid,
	sessionLogin,
	sessionLogout,
} from "~/util/session.server";

export const meta: V2_MetaFunction = () => {
	return [{ title: "New Remix App" }];
};

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	const isGoogleLogin = formData.get("google-login");
	const isLogout = formData.get("google-logout");

	if (isLogout) {
		return await sessionLogout(request);
	}

	if (isGoogleLogin) {
		const idToken = formData.get("idToken");
		return await sessionLogin(request, idToken, "/");
	}

	return {};
};

export const loader: LoaderFunction = async ({ request }) => {
	const { decodedClaims, error } = await isSessionValid(request);

	return { decodedClaims, error };
};

export default function Index() {
	const submit = useSubmit();
	const { decodedClaims, error } = useLoaderData();
	const isLoggedIn = !!decodedClaims?.email;

	const login = () => {
		loginAndCreate().then(async (res) => {
			const idToken = await res.user.getIdToken();

			submit(
				{
					idToken: idToken,
					"google-login": true,
				},
				{ method: "post", action: "/?index" }
			);
		});
	};

	const logout = () => {
		submit(
			{ "google-logout": true },
			{ method: "post", action: "/?index" }
		);
	};

	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
			<h1>Welcome to Remix</h1>
			<Title>Remix!</Title>
			{isLoggedIn ? (
				<button onClick={logout}>Logout</button>
			) : (
				<button onClick={login}>Login</button>
			)}
			<ul>
				<li>
					<a
						target="_blank"
						href="https://remix.run/tutorials/blog"
						rel="noreferrer"
					>
						15m Quickstart Blog Tutorial
					</a>
				</li>
				<li>
					<a
						target="_blank"
						href="https://remix.run/tutorials/jokes"
						rel="noreferrer"
					>
						Deep Dive Jokes App Tutorial
					</a>
				</li>
				<li>
					<a
						target="_blank"
						href="https://remix.run/docs"
						rel="noreferrer"
					>
						Remix Docs
					</a>
				</li>
			</ul>
		</div>
	);
}
