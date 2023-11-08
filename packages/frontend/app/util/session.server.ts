import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { auth } from "../lib/firebaseAdmin.server";

require("dotenv").config({
	path: `../../.env`,
});

const sessionSecret =
	process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
		? "test-env-secret"
		: process.env.SESSION_SECRET;

if (!sessionSecret) {
	throw new Error("SESSION_SECRET must be set");
}
let { getSession, commitSession, destroySession } = createCookieSessionStorage({
	cookie: {
		name: "__session",
		secure: true,
		secrets: [sessionSecret],
		sameSite: "lax", // to help with CSRF
		path: "/",
		maxAge: 60 * 60 * 24 * 5, // 5 days
		httpOnly: true,
	},
});

export const sessionLogin = async (
	request: Request,
	idToken: any,
	redirectTo: any
) => {
	// const token = await auth.verifyIdToken(idToken); // this token should be send to the backend as auth

	return auth
		.createSessionCookie(idToken, {
			expiresIn: 60 * 60 * 24 * 5 * 1000,
		})
		.then(
			(sessionCookie) => {
				// Set cookie policy for session cookie.
				return setCookieAndRedirect(
					request,
					sessionCookie,
					redirectTo,
					idToken
				);
			},
			(error) => {
				return {
					error: `sessionLogin error!: ${error.message}`,
				};
			}
		);
};

export const isSessionValid = async (request: Request) => {
	const session = await getSession(request.headers.get("cookie"));

	try {
		// Verify the session cookie. In this case an additional check is added to detect
		// if the user's Firebase session was revoked, user deleted/disabled, etc.
		const decodedClaims = await auth.verifySessionCookie(
			session.get("idToken"),
			true /** checkRevoked */
		);
		return {
			success: true,
			decodedClaims,
		};
	} catch (error) {
		// Session cookie is unavailable or invalid. Force user to login.
		const message =
			typeof error === "object" &&
			error !== null &&
			"message" in error &&
			typeof error.message === "string"
				? error.message
				: "unknown error";

		return { error: message };
		// throw redirect(redirectTo, {
		// 	statusText: error?.message,
		// });
	}
};

const setCookieAndRedirect = async (
	request: Request,
	sessionCookie: any,
	redirectTo = "/",
	idToken: any
) => {
	const session = await getSession(request.headers.get("cookie"));
	session.set("idToken", sessionCookie);
	session.set("accessToken", idToken);

	return redirect(redirectTo, {
		headers: {
			"Set-Cookie": await commitSession(session),
		},
	});
};

export const sessionLogout = async (request: Request) => {
	const session = await getSession(request.headers.get("cookie"));

	// Verify the session cookie. In this case an additional check is added to detect
	// if the user's Firebase session was revoked, user deleted/disabled, etc.
	return auth
		.verifySessionCookie(session.get("idToken"), true /** checkRevoked */)
		.then((decodedClaims) => {
			return auth.revokeRefreshTokens(decodedClaims?.sub);
		})
		.then(async () => {
			return redirect("/", {
				headers: {
					"Set-Cookie": await destroySession(session),
				},
			});
		})
		.catch((error) => {
			console.log(error);
			// Session cookie is unavailable or invalid. Force user to login.
			return { error: error?.message };
		});
};

export { getSession, commitSession, destroySession };
