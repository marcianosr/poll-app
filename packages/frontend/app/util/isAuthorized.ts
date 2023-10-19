import { isSessionValid } from "./session.server";

export const isAuthorizedUser = async (request: Request) => {
	const { decodedClaims, error } = await isSessionValid(request);

	const isLoggedIn = !!decodedClaims?.email;

	return { isLoggedIn, decodedClaims, error };
};

export const throwIfNotAuthorized = async (request: Request) => {
	const { isLoggedIn, decodedClaims } = await isAuthorizedUser(request);

	if (!isLoggedIn || !decodedClaims) {
		throw new Response(null, {
			status: 404,
			statusText: "Not Found",
		});
	}

	return { decodedClaims };
};
