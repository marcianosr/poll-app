import type {
	AppChannel,
	AppChannelPlaylist,
	Channel,
	Poll,
} from "@marcianosrs/engine";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { API_ENDPOINT } from "~/util";
import { throwIfNotAuthorized } from "~/util/isAuthorized";
import { getSession } from "~/util/session.server";

type LoaderData = {
	channel: AppChannel;
};

export const loader: LoaderFunction = async ({ request, params }) => {
	const session = await getSession(request.headers.get("cookie"));

	await throwIfNotAuthorized(request);

	const id = params.id;

	const channelsResponse = await fetch(`${API_ENDPOINT}/channels/${id}`, {
		headers: {
			Authorization: `Bearer ${session.get("accessToken")}`,
		},
	});

	const pollsResponse = await fetch(`${API_ENDPOINT}/polls`, {
		headers: {
			Authorization: `Bearer ${session.get("accessToken")}`,
		},
	});

	const channelsData: AppChannel = await channelsResponse.json();
	const pollsData: Poll[] = await pollsResponse.json();

	const getPollsByPlaylist = (playlist: AppChannelPlaylist[]) => {
		return playlist.map((poll) => ({
			...pollsData.find((p) => p.id === poll.pollId),
			...poll,
		}));
	};

	const data = {
		...channelsData,
		playlist: getPollsByPlaylist(channelsData.playlist),
	};

	return json({ channel: data });
};

export default function Index() {
	const { channel } = useLoaderData<LoaderData>();

	return (
		<main>
			<h1>Channel: {channel.name}</h1>

			<h2>Polls for this channel</h2>
			<ul>
				{/* TODO: Fix these TS errors */}
				{channel.playlist.map((poll) => (
					<li key={poll.id}>
						<Link to={`/polls/${poll.id}?channel=${channel.slug}`}>
							{poll.question}
						</Link>
					</li>
				))}
			</ul>
		</main>
	);
}
