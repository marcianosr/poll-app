import { initServerFirebase } from "@marcianosrs/server-auth";
import express, { Request, Response } from "express";
import { NextFunction } from "express";
import cors from "cors";

const { db, auth } = initServerFirebase();

const app = express();

app.use(express.json());
app.use(
	cors({
		origin: ["http://localhost:3000", "https://poll-app-ivory.vercel.app"],
	})
);

type AuthTokenRequest = Request & {
	authToken?: string | null;
	authId?: string;
};

const getAuthToken = (
	req: AuthTokenRequest,
	res: Response,
	next: NextFunction
) => {
	if (
		req.headers.authorization &&
		req.headers.authorization.split(" ")[0] === "Bearer"
	) {
		req.authToken = req.headers.authorization.split(" ")[1];
	} else {
		req.authToken = null;
	}
	next();
};

export const checkIfAuthenticated = (
	req: AuthTokenRequest,
	res: Response,
	next: NextFunction
) => {
	getAuthToken(req, res, async () => {
		try {
			const { authToken } = req;

			const userInfo = await auth.verifyIdToken(authToken || "");

			req.authId = userInfo.uid;
			return next();
		} catch (e) {
			return res
				.status(401)
				.send({ error: "You are not authorized to make this request" });
		}
	});
};

export const checkIfAdmin = (
	req: AuthTokenRequest,
	res: Response,
	next: NextFunction
) => {
	getAuthToken(req, res, async () => {
		try {
			const { authToken } = req;

			const userInfo = await auth.verifyIdToken(authToken || "");

			if (userInfo.role === "admin") {
				req.authId = userInfo.uid;
				return next();
			}
		} catch (e) {
			return res
				.status(401)
				.send({ error: "You are not authorized to make this request" });
		}
	});
};

app.get(
	"/polls",
	checkIfAuthenticated,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const polls = db
				.collection("polls")
				.get()
				.then((snapshot) => {
					const polls = snapshot.docs.map((doc) => {
						return {
							id: doc.id,
							...doc.data(),
						};
					});

					return polls;
				});

			res.send(await polls);
		} catch (err) {
			console.log("Error getting document", err);
			next(err);
		}
	}
);

app.get(
	"/polls/:id",
	checkIfAuthenticated,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const doc = await db.collection("polls").doc(req.params.id).get();

			if (!doc.exists) {
				throw new Error("404 poll not found");
			}

			const pollData = doc.data();
			res.send(pollData);
		} catch (err) {
			console.log("Error getting document", err);
			next(err);
		}
	}
);

app.listen(process.env.PORT || 1305, () => {
	console.log(`Server Started at ${1305}`);
});

// export * from "./roles";
