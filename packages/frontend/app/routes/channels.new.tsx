import {
	type PollTag,
	type ChannelTypeMap,
	type PollDTO,
	POLL_TAGS,
} from "@marcianosrs/engine";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { useState, type PropsWithChildren, Fragment, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { API_ENDPOINT } from "~/util";
import { throwIfNotAuthorized } from "~/util/isAuthorized";
import { getSession, isSessionValid } from "~/util/session.server";

function buildChannel<K extends keyof ChannelTypeMap>(
	key: K,
	channel: ChannelTypeMap[K]
): ChannelTypeMap[K] {
	return {
		...channel,
		distributionChannelName: key,
	};
}

export const action: ActionFunction = async ({ request }) => {
	await throwIfNotAuthorized(request);

	const { decodedClaims } = await isSessionValid(request);
	const session = await getSession(request.headers.get("cookie"));

	let formData = await request.formData();
	const name = formData.get("channelName") as string;
	const pollPlaylistIds = (await formData.getAll("pollPlaylist")) as string[];

	const channel = buildChannel("App", {
		id: uuidv4(),
		playerIds: [],
		moderatorIds: [decodedClaims?.uid || ""],
		name,
		slug: name.toLowerCase().replace(/\s/g, "-"),
		playlist: [
			...pollPlaylistIds.map((id: string) => ({
				pollId: id,
				openedAt: null,
				status: "upcoming" as any,
				votedBy: [],
			})),
		],
		plugins: [],
		createdAt: Date.now(),
		createdBy: decodedClaims?.uid || null,
		distributionChannelName: "App",
	});

	const createChannel = async () => {
		const response = await fetch(`${API_ENDPOINT}/channels/new`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${session.get("accessToken")}`,
			},
			body: JSON.stringify(channel),
		});

		return response.json();
	};

	const errors = await createChannel();
	console.log("errors:", errors);

	if (errors.length > 0) {
		return {
			errors: errors,
		};
	}

	return redirect("/channels");
};

export const loader: LoaderFunction = async ({ request }) => {
	const session = await getSession(request.headers.get("cookie"));

	await throwIfNotAuthorized(request);

	const response = await fetch(`${API_ENDPOINT}/polls`, {
		headers: {
			Authorization: `Bearer ${session.get("accessToken")}`,
		},
	});

	const data = await response.json();

	return { polls: data };
};

export default function NewChannel() {
	return (
		<main>
			<Link to="/channels">Back to list of channels</Link>
			<h1>Create new channel</h1>
			<ChannelForm />
		</main>
	);
}

export const ChannelForm = (): PropsWithChildren<any> => {
	const action = useActionData<{ errors: string[] }>();
	const { polls } = useLoaderData<{ polls: PollDTO[] }>();
	const [filteredPolls, setFilteredPolls] = useState<PollDTO[]>(polls);
	const [currentTags, setCurrentTags] = useState<PollTag[]>([]);

	useEffect(() => {
		if (currentTags.length === 0) {
			setFilteredPolls(polls);
		} else {
			setFilteredPolls(
				polls.filter((poll: PollDTO) => {
					return currentTags.some((tag) => poll.tags.includes(tag));
				})
			);
		}
	}, [currentTags, polls]);

	return (
		<Form method="post" className="form">
			{action?.errors.map((error) => (
				<p key={error}>{error}</p>
			))}

			<label htmlFor="channelName">Channel name</label>
			<input type="text" name="channelName" />

			<div>
				<h3>Active filters: {currentTags.join(" ")}</h3>

				{POLL_TAGS.map((tag) => (
					<Fragment key={tag}>
						<input
							type="checkbox"
							id={tag}
							name="tags"
							value={tag}
							onChange={(e) => {
								if (e.target.checked) {
									setCurrentTags([
										...currentTags,
										e.target.value as PollTag,
									]);
								} else {
									setCurrentTags(
										currentTags.filter(
											(tag) => tag !== e.target.value
										)
									);
								}
							}}
						/>
						<label key={tag} htmlFor={tag}>
							{tag}
						</label>
					</Fragment>
				))}
			</div>
			<ul>
				{filteredPolls.map((poll: PollDTO) => (
					<li key={poll.id}>
						<input
							id={poll.id}
							type="checkbox"
							name="pollPlaylist"
							value={poll.id}
						/>
						<label htmlFor={poll.id}>{poll.question}</label>
					</li>
				))}
			</ul>
			<button type="submit" disabled={false}>
				Create channel
			</button>
		</Form>
	);
};
