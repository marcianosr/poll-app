import type {
	ActionFunction,
	LoaderFunction,
	Session,
	SessionData,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { API_ENDPOINT } from "~/util";
import { throwIfNotAuthorized } from "~/util/isAuthorized";
import { getSession, isSessionValid } from "~/util/session.server";
import type { AppChannelPlaylist, Channel, Poll } from "@marcianosrs/engine";
import { useState } from "react";

type LoaderData = {
	poll: Poll & AppChannelPlaylist;
	selectedChannel: string | null;
	joinedChannels: Channel<AppChannelPlaylist>[];
};

export const action: ActionFunction = async ({ request, params }) => {
	await throwIfNotAuthorized(request);

	const { decodedClaims } = await isSessionValid(request);
	const session = await getSession(request.headers.get("cookie"));

	const formData = await request.formData();
	const selectedVotes = formData.getAll("selectedVotes");

	return {};
};

const getJoinedChannels = async (
	session: Session<SessionData>,
	uid: string
): Promise<Channel<AppChannelPlaylist>[]> => {
	const response = await fetch(`${API_ENDPOINT}/channels/joined`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${session.get("accessToken")}`,
			user: uid,
		},
	});

	const data = await response.json();

	console.log(data);
	return data;
};

const getPollById = async (session: Session<SessionData>, id: string) => {
	const response = await fetch(`${API_ENDPOINT}/polls/${id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${session.get("accessToken")}`,
		},
	});

	return response.json();
};

export const loader: LoaderFunction = async ({ request, params }) => {
	const session = await getSession(request.headers.get("cookie"));
	const { decodedClaims } = await isSessionValid(request);
	const uid = decodedClaims?.uid || "";

	await throwIfNotAuthorized(request);

	const url = new URL(request.url);
	const selectedChannelFromQuery = url.searchParams.get("channel");

	const joinedChannels = await getJoinedChannels(session, uid);

	if (!selectedChannelFromQuery) {
		return {
			joinedChannels,
		};
	}

	const getSelectedChannel = joinedChannels.find(
		(channel: Channel<AppChannelPlaylist>) =>
			channel.slug === selectedChannelFromQuery
	) as Channel<AppChannelPlaylist>;

	if (!getSelectedChannel) {
		return {
			joinedChannels,
			selectedChannel: selectedChannelFromQuery,
		};
	}

	const getPollIdFromSelectedChannel =
		getSelectedChannel.playlist.find(
			(poll: AppChannelPlaylist) => poll.pollId === params.id
		) || [];

	return json({
		poll: !getPollIdFromSelectedChannel
			? null
			: {
					...(await getPollById(
						session,
						getPollIdFromSelectedChannel.pollId
					)),
					...getPollIdFromSelectedChannel,
			  },
		selectedChannel: selectedChannelFromQuery,
		joinedChannels,
	});
};

export default function PollDetail() {
	const { poll, selectedChannel, joinedChannels } =
		useLoaderData<LoaderData>();
	const [selectedVotes, setSelectedVotes] = useState<string[]>([]);
	const transition = useNavigation();

	const hasJoinedChannel: boolean = !!joinedChannels?.find(
		(channel: Channel<AppChannelPlaylist>) =>
			channel.slug === selectedChannel
	);

	const isPollOpen = poll.status === "open";

	const isVoteButtonDisabled =
		selectedVotes.length === 0 ||
		transition.state === "submitting" ||
		transition.state === "loading";

	if (!hasJoinedChannel && selectedChannel) {
		return (
			<main>
				<h1>You can't vote because you're not in this channel!</h1>
				<p>
					Please join the channel{" "}
					<Link to={`/channels/${selectedChannel}`}>
						{selectedChannel}
					</Link>{" "}
					to vote.
				</p>
			</main>
		);
	}

	// What to do when no channel is given?
	if (!selectedChannel)
		return (
			<section>
				<h1>
					A channel was not selected. Please select one of your joined
					channels, or see the list of
					<Link to="/channels"> all channels</Link>
				</h1>

				<p>Your joined channels: </p>

				<ul>
					{joinedChannels.map((channel) => (
						<li key={channel.id}>
							<Link to={`?channel=${channel.slug}`}>
								{channel.name}
							</Link>
							{" => "}
							<Link to={`/channels/${channel.slug}`}>
								Go to channel
							</Link>
						</li>
					))}
				</ul>
			</section>
		);

	if (!poll) {
		return <h1>This poll is not in this channel!</h1>;
	}

	return (
		<main>
			<p>
				This poll is <strong>{poll.status}</strong>
			</p>
			<small>#{poll.no}</small>
			<h1>{poll.question}</h1>
			<ul>
				{poll.tags.map((tag) => (
					<li key={tag}>{tag}</li>
				))}
			</ul>

			<ul>
				<h3>Channels:</h3>
				<small>Selected channel: {selectedChannel} </small>
				{joinedChannels.map((channel) => (
					<li key={channel.id}>
						<Link to={`/channels/${channel.slug}`}>
							{channel.name}
						</Link>
					</li>
				))}
			</ul>

			<Form method="POST">
				<ul>
					{poll.options.map((option) => (
						<li key={option.id}>
							<label htmlFor={option.id}>{option.value}</label>
							<input
								id={option.id}
								name="votes"
								value={option.value}
								onChange={(e) => {
									if (poll.type === "single-choice") {
										setSelectedVotes([e.target.value]);
									}

									if (poll.type === "multiple-choice") {
										setSelectedVotes([
											...selectedVotes,
											e.target.value,
										]);
									}
								}}
								type={
									poll.type === "single-choice"
										? "radio"
										: "checkbox"
								}
							/>
						</li>
					))}
				</ul>
				<button type="submit" disabled={isVoteButtonDisabled}>
					Cast your vote
				</button>
			</Form>
		</main>
	);
}
