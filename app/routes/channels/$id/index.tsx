import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useAuth } from "~/providers/AuthProvider";
import styles from "~/styles/new-channel.css";
import { Text } from "~/ui/Text";
import { Title } from "~/ui/Title";
import { links as commonStyleLinks } from "../../polls/commonStyleLinks";

import {
	ChannelPollStatus,
	FirebaseChannel,
	addUserToChannel,
	getChannelByName,
	updateChannelById,
} from "~/utils/channels";
import { Form, useLoaderData } from "@remix-run/react";
import { getPollById, PollData } from "~/utils/polls";
import { PollOverview } from "~/admin/components/PollOverview";
import { getUserByID } from "~/utils/user";
import { Photo, links as photoLinks } from "~/ui/Photo";
import { User, getAuth } from "firebase/auth";
import { PhotoList, links as photoLinksStyles } from "~/ui/PhotoList";
import { Button } from "~/ui/Button";

export function links() {
	return [
		...commonStyleLinks(),
		...photoLinksStyles(),
		...photoLinks(),
		{ rel: "stylesheet", href: styles },
	];
}

export const action: ActionFunction = async ({ request, params }) => {
	let formData = await request.formData();

	const auth = getAuth();

	const joinChannelForm = formData.get("join-channel");

	const { id } = params;
	const channelId = id || "";
	const channel = await getChannelByName(channelId);

	if (joinChannelForm === "JOIN_CHANNEL") {
		// console.log("SUBMIT JOIN CHANNEL FORM", channel);

		// Get the user id here and add it to the channel
		// addUserToChannel(channelId);

		// addParticipantToChannel(channel, request);

		return {};
	}

	// return {};

	if (!channel) {
		return {
			error: "Channel not found",
		};
	}

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

export default function ChannelDetail() {
	const { user } = useAuth();
	const { channel, polls, participants } = useLoaderData();

	const isChannelOwner = channel.moderatorsIds.find(
		(id: string) => user?.firebase.id === id
	);

	const userJoinedChannel = channel.participantsIds.find(
		(id: string) => user?.firebase.id === id
	);

	return (
		user && (
			<section className="new-channel-page">
				<Form method="post">
					<Button
						variant="submit"
						type="submit"
						value="JOIN_CHANNEL"
						name="join-channel"
						state={userJoinedChannel && "disabled"}
					>
						{userJoinedChannel ? "Joined" : "Join channel"}
					</Button>
					<input type="hidden" name="uid" defaultValue={user.uid} />
				</Form>
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
