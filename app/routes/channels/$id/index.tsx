import { LoaderFunction } from "@remix-run/node";
import { useAuth } from "~/providers/AuthProvider";
import styles from "~/styles/new-channel.css";
import { Text } from "~/ui/Text";
import { Title } from "~/ui/Title";
import { links as commonStyleLinks } from "../../polls/commonStyleLinks";

import { FirebaseChannel, getChannelByName } from "~/utils/channels";
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

export const loader: LoaderFunction = async ({ params }) => {
	const channel = (await getChannelByName(
		params.id || ""
	)) as FirebaseChannel;

	if (!channel)
		throw new Response("Not Found", {
			status: 404,
		});

	const getPollsForChannel = Promise.all(
		channel.pollQueue.map(async (pollQueue: { documentId: string }) => {
			const poll = await getPollById(pollQueue.documentId);
			return poll;
		})
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
	const { user, isAdmin, isModerator } = useAuth();
	const { channel, polls, participants } = useLoaderData();
	return (
		user && (
			<section className="new-channel-page">
				<Title size="xl" variant="primary">
					{channel.name}
				</Title>
				<Title size="md" variant="primary" tag="h2">
					Polls for this channel
				</Title>
				<PollOverview polls={polls} />
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