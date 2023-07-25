import { initServerFirebase } from "@marcianosrs/server-auth";
import express, { Request, Response } from "express";
import { NextFunction } from "express";
import cors from "cors";
import {
	CreatePoll,
	UpdatePoll,
	validateCreatePoll,
	validateCreateChannel,
} from "@marcianosrs/engine";

const { db, auth, FieldValue } = initServerFirebase();

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
	// checkIfAuthenticated,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const polls = db
				.collection("polls")
				.get()
				.then((snapshot) => {
					const polls = snapshot.docs.map((doc) => {
						return {
							...doc.data(),
							id: doc.id,
						};
					});

					return polls;
				});

			res.json(await polls);
		} catch (err) {
			console.log("Error getting document", err);
			next(err);
		}
	}
);

app.get("/polls/count", async (req: Request, res: Response) => {
	try {
		const polls = db.collection("polls").get();

		res.json((await polls).size);
	} catch (err) {
		console.log("Error getting document", err);
	}
});

app.post(
	"/polls/new",
	// checkIfAuthenticated,
	async (req: Request, res: Response) => {
		try {
			const poll: CreatePoll = req.body;

			const errors = validateCreatePoll(poll);

			if (errors.length > 0) {
				return res.status(400).json(errors);
			}

			const newPoll = await db.collection("polls").add(poll);

			return res.json({ pollId: newPoll.id });
		} catch (err) {
			console.log("Error getting document", err);
			return res.status(500).json({ error: "Internal server error" });
		}
	}
);

app.put("/polls/:id/edit", async (req: Request, res: Response) => {
	console.log("Updating poll", req.body);
	try {
		const poll = req.body;

		const errors = validateCreatePoll(poll);

		if (errors.length > 0) {
			return res.status(400).json(errors);
		}

		const updatePoll = await db
			.collection("polls")
			.doc(req.params.id)
			.update(poll);

		return res.json({ message: "Poll updated" });
	} catch (err) {
		console.log("Error getting document", err);
		return res.status(500).json({ error: "Internal server error" });
	}
});

app.get(
	"/polls/:id",
	// checkIfAuthenticated,
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

app.get(
	"/channels",
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const channels = db
				.collection("channels")
				.get()
				.then((snapshot) => {
					const polls = snapshot.docs.map((doc) => {
						return {
							...doc.data(),
							id: doc.id,
						};
					});

					return polls;
				});

			res.json(await channels);
		} catch (err) {
			console.log("Error getting document", err);
			next(err);
		}
	}
);

app.get(
	"/channels/:id",
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const doc = await db
				.collection("channels")
				.doc(req.params.id)
				.get();

			if (!doc.exists) {
				throw new Error("404 channel not found");
			}

			const channelData = doc.data();
			res.send(channelData);
		} catch (err) {
			console.log("Error getting document", err);
			next(err);
		}
	}
);

app.post(
	"/channels/new",
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const channel = req.body;

			// Fetch channels with the given name from the database
			const channelSnapshot = await db
				.collection("channels")
				.where("name", "==", channel.name)
				.get();

			// // Check if a channel with the given name already exists
			// if (!channelSnapshot.empty) {
			// 	return res
			// 		.status(400)
			// 		.json({ error: "Channel with this name already exists" });
			// }

			const errors = validateCreateChannel(channel, channelSnapshot);

			if (errors.length > 0) {
				return res.status(400).json(errors);
			}

			const newChannel = await db.collection("channels").add(channel);

			return res.json({ message: "Channel created" });
		} catch (err) {
			console.log("Error getting document", err);
			next(err);
			return res.status(500).json({ error: "Internal server error" });
		}
	}
);

app.post(
	"/channels/:id/join",
	async (req: Request, res: Response, next: NextFunction) => {
		console.log("Call join route");
		const data = req.body;

		try {
			const channelRef = db.collection("channels").doc(req.params.id);
			const channelDoc = await db
				.collection("channels")
				.doc(req.params.id)
				.get();

			if (!channelDoc.exists) {
				throw new Error("404 channel not found");
			}

			console.log(FieldValue);
			console.log(data.playerId);

			await channelRef.update({
				playerIds: FieldValue.arrayUnion(data.user),
			});

			console.log("JOIN");
		} catch (err) {
			console.log("Error getting document", err);
			next(err);
			return res.status(500).json({ error: "Internal server error" });
		}
	}
);

app.listen(process.env.PORT || 1305, () => {
	console.log(`Server Started at ${1305}`);
});

// export * from "./roles";
