import type { AppChannel } from "@marcianosrs/engine";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { API_ENDPOINT } from "~/util";
import { throwIfNotAuthorized } from "~/util/isAuthorized";
import { getSession, isSessionValid } from "~/util/session.server";

type LoaderData = {
	channels: AppChannel[];
	user: any;
};

export const loader: LoaderFunction = async ({ request }) => {
	const session = await getSession(request.headers.get("cookie"));
	const { decodedClaims } = await isSessionValid(request);

	await throwIfNotAuthorized(request);

	const response = await fetch(`${API_ENDPOINT}/channels`, {
		headers: {
			Authorization: `Bearer ${session.get("accessToken")}`,
		},
	});

	const data = await response.json();

	return json({ channels: data, user: decodedClaims });
};

export default function Index() {
	const { channels, user } = useLoaderData<LoaderData>();

	// TODO: Add firebase realtime updates, so the button is disabled when the user is already in the channel

	return (
		<main>
			<h1>Channels</h1>
			<Link to={"/channels/new"}>Create new channel</Link>
			<ul>
				{channels.map((channel: AppChannel) => (
					<li key={channel.id}>
						<Link to={`/channels/${channel.slug}`}>
							{channel.name}
						</Link>
						<button
							disabled={channel.playerIds.includes(user.uid)}
							onClick={(e) => {
								e.preventDefault();

								fetch(
									`${API_ENDPOINT}/channels/${channel.id}/join`,
									{
										method: "POST",
										headers: {
											"Content-Type": "application/json",
										},
										body: JSON.stringify({
											channel: channel.id,
											user: user.uid,
										}),
									}
								);
							}}
						>
							Join
						</button>
					</li>
				))}
			</ul>
		</main>
	);
}
