import type {
	ActionFunction,
	LoaderFunction,
	MetaFunction,
} from "@remix-run/node";
import { Title } from "@marcianosrs/ui";
import { NavLink, useLoaderData, useSubmit } from "@remix-run/react";

import { loginAndCreate } from "@marcianosrs/client-auth";
import {
	isSessionValid,
	sessionLogin,
	sessionLogout,
} from "~/util/session.server";
import { getChannels } from "./api.server";
import type { ChannelDTO } from "@marcianosrs/engine";

export const meta: MetaFunction = () => {
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
	const channels = await getChannels();
	return { decodedClaims, error, channels };
};

export default function Index() {
	const submit = useSubmit();
	const { decodedClaims, channels } = useLoaderData<{
		decodedClaims: Awaited<
			ReturnType<typeof isSessionValid>
		>["decodedClaims"];
		channels: ChannelDTO[];
	}>();
	const isLoggedIn = !!decodedClaims?.email;

	const login = () => {
		loginAndCreate().then(async (res) => {
			const idToken = await res.user.getIdToken();

			submit(
				{
					idToken: idToken,
					"google-login": "true",
				},
				{ method: "post", action: "/?index" }
			);
		});
	};

	const logout = () => {
		submit(
			{ "google-logout": "true" },
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
					<a href="/polls/new">Suggest a poll</a>
				</li>
				{channels.map((channel) => (
					<li key={channel.slug}>
						<NavLink to={`/c/${channel.slug}`}>
							{channel.name}
						</NavLink>
					</li>
				))}
			</ul>
		</div>
	);
}
