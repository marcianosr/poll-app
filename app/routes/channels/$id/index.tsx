import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useAuth } from "~/providers/AuthProvider";
import styles from "~/styles/new-channel.css";
import { Text } from "~/ui/Text";
import { Title } from "~/ui/Title";
import { links as commonStyleLinks } from "../../polls/commonStyleLinks";

import {
	ChannelPollStatus,
	FirebaseChannel,
	getChannelByName,
	updateChannelById,
} from "~/utils/channels";
import { useLoaderData } from "@remix-run/react";
import { getPollById, PollData } from "~/utils/polls";
import { PollOverview } from "~/admin/components/PollOverview";
import { getUserByID } from "~/utils/user";
import { Photo, links as photoLinks } from "~/ui/Photo";
import { User } from "firebase/auth";
import { PhotoList, links as photoLinksStyles } from "~/ui/PhotoList";

export function links() {
	return [
		...commonStyleLinks(),
		...photoLinksStyles(),
		...photoLinks(),
		{ rel: "stylesheet", href: styles },
	];
}

export const action: ActionFunction = async ({ request, params }) => {
	const { id } = params;
	const channel = await getChannelByName(id || "");

	if (!channel) {
		return {
			error: "Channel not found",
		};
	}

	let formData = await request.formData();

	const pollDocumentId = formData.get("documentId") as string;
	const pollStatus = formData.get("status");

	const currentPoll = channel?.pollQueue.find(
		(poll: PollData) => poll.documentId === pollDocumentId
	);

	updateChannelById(channel.documentId || "", {
		pollQueue: [
			...(channel?.pollQueue.filter(
				(poll: PollData) => poll.documentId !== pollDocumentId
			) || []),
			{
				...currentPoll,
				status: pollStatus,
			},
		],
	});

	return {
		error: false,
	};
};

export const loader: LoaderFunction = async ({ params }) => {
	const channel = (await getChannelByName(
		params.id || ""
	)) as FirebaseChannel;

	if (!channel)
		throw new Response("Not Found", {
			status: 404,
		});

	const getPollsForChannel = Promise.all(
		channel.pollQueue.map(
			async (pollQueue: {
				documentId: string;
				status: ChannelPollStatus;
			}) => {
				const poll = await getPollById(pollQueue.documentId);

				return {
					...poll,
					documentId: pollQueue.documentId,
					status: pollQueue.status,
				};
			}
		)
	);

	const polls = await getPollsForChannel;
	const participants = await Promise.all(
		channel.participantsIds.map(async (participantId: string) => {
			const participant = await getUserByID(participantId);
			return participant;
		})
	);

	return { polls, channel, participants };
};

export default function NewChannel() {
	const { user } = useAuth();
	const { channel, polls, participants } = useLoaderData();

	const isChannelOwner = channel.moderatorsIds.find(
		(id: string) => user?.firebase.id === id
	);

	return (
		user && (
			<section className="new-channel-page">
				<Title size="xl" variant="primary">
					{channel.name}
				</Title>

				{isChannelOwner && (
					<>
						<Title size="md" variant="primary" tag="h2">
							Polls for this channel
						</Title>
						<PollOverview polls={polls} channel={channel} />
					</>
				)}
				<section>
					<Title size="md" variant="primary" tag="h2">
						Participants
					</Title>
					<PhotoList
						voters={participants.map((participant: User) => ({
							photo: {
								url: participant.photoURL || "",
								displayName: participant.displayName || "",
							},
						}))}
					/>
				</section>
			</section>
		)
	);
}
