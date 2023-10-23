import express, { Request, Response } from "express";
import { NextFunction } from "express";
import cors from "cors";
import {
	CreatePollDTO,
	validateCreatePoll,
	validateCreateChannel,
	AppChannelPlaylist,
} from "@marcianosrs/engine";
import { FieldValue, auth, db } from "./firebase";
import { createPoll, getPolls } from "./polls";

const app = express();

app.use(express.json());
app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"http://localhost:3001",
			"https://poll-app-ivory.vercel.app",
		],
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
			const polls = await getPolls();
			res.json(polls);
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
			const data: CreatePollDTO = req.body;

			const createdPoll = await createPoll(data);
			return res.json(createdPoll);
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

app.post("/polls/:id/vote", async (req: Request, res: Response) => {
	try {
		const channel = await db
			.collection("channels")
			.where("slug", "==", req.body.channel)
			.get();

		if (!channel.docs.length) {
			throw new Error("404 channel not found");
		}

		const userDidVote = channel.docs[0]
			.data()
			.playlist.find(
				(playlistItem: AppChannelPlaylist) =>
					playlistItem.pollId === req.params.id &&
					playlistItem.votedBy.includes(req.body.uid)
			);

		if (userDidVote) {
			return res.status(400).json({ error: "User already voted" });
		}

		const currentChannel = channel.docs[0].data();

		const updatedPlaylist = currentChannel.playlist.map(
			(playlistItem: AppChannelPlaylist) => {
				if (playlistItem.pollId === req.params.id) {
					playlistItem.votedBy.push(req.body.uid);
				}

				return playlistItem;
			}
		);

		channel.docs[0].ref.update({ playlist: updatedPlaylist });

		return res.json({ message: "Vote added" });
	} catch (err) {
		console.log("Error getting document", err);
		return res.status(500).json({ error: "Internal server error" });
	}
});

app.get(
	"/channels",
	async (req: Request, res: Response, next: NextFunction) => {
		console.log("Call channels route");
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

app.get("/channels/joined", async (req: Request, res: Response) => {
	const user = req.headers.user;

	try {
		const joinedChannels = db
			.collection("channels")
			.where("playerIds", "array-contains", user)
			.get();
		res.json((await joinedChannels).docs.map((doc) => doc.data()));
	} catch (err) {
		console.log("Error getting document", err);
	}
});

app.get(
	"/channels/:id",
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const doc = await db
				.collection("channels")
				.where("slug", "==", req.params.id)
				.get();

			console.log("RE", req.params.id);

			if (doc.empty) {
				throw new Error("404 channel not found");
			}

			const channel = doc.docs[0].data();

			res.send(channel);
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

			const channelSnapshot = await db
				.collection("channels")
				.where("name", "==", channel.name)
				.get();

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

app.get("/channels/names", async (req: Request, res: Response) => {
	try {
		const channels = db.collection("channels").get();

		res.json((await channels).docs.map((doc) => doc.data().name));
	} catch (err) {
		console.log("Error getting document", err);
	}
});

const port = process.env.PORT || 1305;
app.listen(port, () => {
	console.log(`Server Started at ${port}`);
});
