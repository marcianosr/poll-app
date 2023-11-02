import {
	type PollDTO,
	type ChannelDTO,
	questionTypeStore,
} from "@marcianosrs/engine";
import {
	json,
	type LoaderFunction,
	type ActionFunction,
} from "@remix-run/node";
import { useOutletContext, useLoaderData, useSubmit } from "@remix-run/react";
import { throwIfNotAuthorized } from "~/util/isAuthorized";
import { addPollToChannel, getPolls } from "./api.server";
import { Button } from "@marcianosrs/ui";
import { parse } from "qs";

type LoaderData = {
	polls: PollDTO[];
};

export const loader: LoaderFunction = async ({ request }) => {
	await throwIfNotAuthorized(request);

	const polls = await getPolls();

	return json({ polls });
};

export const action: ActionFunction = async ({ request }) => {
	await throwIfNotAuthorized(request);
	const data = await request.text();
	const formData = parse(data) as { channelId: string; pollId: string };

	addPollToChannel(formData.channelId, formData.pollId);

	return null;
};

export default function Channel() {
	const { channel } = useOutletContext<{ channel: ChannelDTO }>();
	const { polls } = useLoaderData<LoaderData>();
	const submit = useSubmit();

	return (
		<div>
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
