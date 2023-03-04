import { createCookie } from "@remix-run/node";

export const session = createCookie("session", {
	secrets: ["some secret"],
	// Ensure this is the same as the expiry date on the JWT!!
	expires: new Date(Date.now() + 60 * 60 * 24 * 5 * 1000),
	path: "/",
});
