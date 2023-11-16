import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { useSubmit } from "@remix-run/react";

import { loginForTesting } from "@marcianosrs/client-auth";
import { sessionLogin } from "~/util/session.server";

export const meta: MetaFunction = () => {
	return [{ title: "New Remix App" }];
};

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	const isGoogleLogin = formData.get("google-login");

	if (isGoogleLogin) {
		const idToken = formData.get("idToken");
		return await sessionLogin(request, idToken, "/");
	}

	return {};
};

export default function Index() {
	const submit = useSubmit();

	const login = () => {
		loginForTesting().then(async (res) => {
			const idToken = await res.user.getIdToken();

			submit(
				{
					idToken: idToken,
					"google-login": "true",
				},
				{ method: "post", action: "/test/auth?index" }
			);
		});
	};

	return (
		<div>
			<h1>Fake login for testing on CI</h1>
			<button onClick={login}>Login</button>
		</div>
	);
}
