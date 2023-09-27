import { commitSession, getSession } from "~/util/session.server";
import { expect, test, vi } from "vitest";
import { API_ENDPOINT } from "~/util";
import { loader } from "../_index";

vi.mock("../../lib/firebaseAdmin.server", () => {
	console.log("Mocked firebaseAdmin.server is used.");
	return {
		auth: {
			verifySessionCookie: () => {
				console.log("Mocked verifySessionCookie is called.");
				return Promise.resolve({
					uid: "mocked_uid",
					decodedClaims: {
						uid: "mocked_uid",
						claims: {
							role: "admin",
						},
					},
				});
			},
		},
		app: {}, // provide other necessary mock implementations
		db: {}, // provide other necessary mock implementations
		FieldValue: {},
	};
});

test("returning poll data when user is authenticated", async () => {
	const session = await getSession();
	session.set("accessToken", "banjo-kazooie");
	session.set("idToken", "banjo-kazooie");

	// console.log("SESS", session.get("accessToken"));

	const request = new Request(`${API_ENDPOINT}/polls`, {
		headers: { cookie: await commitSession(session) },
	});

	const data = await loader({
		request,
		params: {},
		context: {},
	});

	console.log("respomse:", data);

	// expect(response.status).toBe(200);
	// expect(loader).toBeDefined();
	// loader();
});
