import { questionTypeStore } from "@marcianosrs/engine";
import type {
	ChannelPollItemDTO,
	PollDTO,
	ChannelDTO,
} from "@marcianosrs/engine";
import {
	json,
	type LoaderFunction,
	type ActionFunction,
	redirect,
} from "@remix-run/node";
import { useOutletContext, useLoaderData, useSubmit } from "@remix-run/react";
import { throwIfNotAuthorized } from "~/util/isAuthorized";
import {
	addPollToChannel,
	getChannelBySlug,
	getOpenPollForChannel,
	getPolls,
	openNextPoll,
} from "./api.server";
import { Button } from "@marcianosrs/ui";
import { parse } from "qs";

type LoaderData = {
	polls: PollDTO[];
	openPoll: null | ChannelPollItemDTO;
};

export const loader: LoaderFunction = async ({ request, params }) => {
	await throwIfNotAuthorized(request);
	const channelSlug = params.channelSlug;
	if (!channelSlug) {
		throw new Error("Channel is required");
	}

	const channel = await getChannelBySlug(channelSlug);
	if (!channel) {
		throw new Error(`Channel not found: ${channelSlug}`);
	}

	const polls = await getPolls();
	const openPoll = await getOpenPollForChannel(channel.id);

	return json({ polls, openPoll });
};

export const action: ActionFunction = async ({ params, request }) => {
	await throwIfNotAuthorized(request);
	const data = await request.text();
	const formData = parse(data) as
		| {
				action: "add-poll";
				channelId: string;
				pollId: string;
		  }
		| { action: "open-poll" };

	if (formData.action === "add-poll") {
		addPollToChannel(formData.channelId, formData.pollId);
	}

	if (formData.action === "open-poll" && params.channelSlug) {
		const channel = await getChannelBySlug(params.channelSlug);
		if (channel) {
			const scorePluginsActive =
				channel.scoreModifiers?.map((mod) => mod.processor) ?? [];
			openNextPoll(channel, scorePluginsActive);
		} else {
			return json({ error: "Channel not found" });
		}
	}

	return redirect(`/c/${params.channelSlug}/manage/add-content`);
};

export default function Channel() {
	const { channel } = useOutletContext<{ channel: ChannelDTO }>();
	const { polls, openPoll } = useLoaderData<LoaderData>();
	const submit = useSubmit();

	return (
		<div>
			{openPoll && <div>Close Poll</div>}
			{!openPoll && channel.queue.length > 0 && (
				<Button
					onClick={() => {
						submit({ action: "open-poll" }, { method: "POST" });
					}}
				>
					Open Poll
				</Button>
			)}
			<ul>
				{polls.map((poll) => {
					const pluginType = poll.question.type;

					if (!pluginType) return null;

					const plugin = questionTypeStore.get(pluginType);
					const name = plugin.getContentTitle(poll.question.data);

					return (
						<li key={poll.id}>
							# {name}{" "}
							<Button
								onClick={() => {
									submit(
										{
											action: "add-poll",
											channelId: channel.id,
											pollId: poll.id,
										},
										{ method: "POST" }
									);
								}}
							>
								Add question to c/{channel.slug}
							</Button>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
