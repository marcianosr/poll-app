import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { awards } from "~/components/Awards";
import { Filters } from "~/admin/components/Filters";
import { useAuth } from "~/providers/AuthProvider";
import { createDevData, createKabisaPolls } from "~/utils/dev";
import { getAllPollsWithIds, PollData, resetVotesForPoll } from "~/utils/polls";
import { createSeason, getAllSeasons, PollAwardData } from "~/utils/seasons";
import { getAdminUser, getUsers, resetSeasonStreak } from "~/utils/user";
import {
	PollOverview,
	links as pollOverviewLinks,
} from "~/admin/components/PollOverview";
import { Title } from "~/ui/Title";

type PollDataWithDocumentId = PollData & {
	documentId: string;
};

export function links() {
	return [...pollOverviewLinks()];
}

export const action: ActionFunction = async ({ request }) => {
	const polls = (await getAllPollsWithIds()) as PollDataWithDocumentId[];
	const seasons = await getAllSeasons();
	// Seasons are DESC
	const getLastSeason = seasons[0];
	const today = Date.now();

	const pollsBySeason: PollAwardData[] = polls
		.filter((poll) => {
			if (!getLastSeason) {
				return poll.openingTime && poll.openingTime < today;
			}
			return (
				poll.openingTime &&
				poll.openingTime < today &&
				poll.openingTime &&
				poll.openingTime > getLastSeason.date
			);
		})
		.map((poll) => ({
			id: poll.id,
			voted: poll.voted,
			documentId: poll.documentId,
		}));

	pollsBySeason.map(async (poll) => await resetVotesForPoll(poll.documentId));

	const users = await getUsers();
	users.map(async (user) => await resetSeasonStreak(user.id));

	createSeason({
		awards: awards(users, polls)
			.filter((award) => award.type === "award")
			.map(({ name, description, requirements }) => ({
				name,
				description,
				winner: {
					id: requirements(users)[0]?.id || "no-winner",
					displayName:
						requirements(users)[0]?.displayName || "no-winner",
				},
			})),
		polls: pollsBySeason,
		season: seasons.length + 1,
		date: today,
	});

	return { message: "Reset season!" };
};

export const loader: LoaderFunction = async ({ params }) => {
	// const isAdmin =
	// 	(await (await getAdminUser()).map((user) => user.role)[0]) === "admin";

	// if (!isAdmin) {
	// 	return redirect("/");
	// }

	const polls = await getAllPollsWithIds();

	// ! Enable when you want local DB population
	// await createDevData();

	return { polls };
};

export default function AllPolls() {
	const { polls } = useLoaderData();
	const { user, isAdmin, isModerator } = useAuth();
	const [renderedPolls, setRenderedPolls] = useState(polls);

	const pollsFromSuggesters = polls.filter(
		(poll: PollData) =>
			poll.sentInByUser && poll?.sentInByUser.id !== user?.firebase.id
	);

	const pollsByUser = polls.filter(
		(poll: PollData) =>
			poll.sentInByUser && poll?.sentInByUser.id === user?.firebase.id
	);

	return (
		<section style={{ color: "white" }}>
			{isAdmin && (
				<>
					<h1>All polls</h1>
					<Form method="post">
						<button>Save current season and reset</button>
						<input
							type="hidden"
							name="season-reset"
							readOnly
							value="season-reset"
						/>
					</Form>
					<Filters setRenderedPolls={setRenderedPolls} />
					<Link to="/polls/new">Create new poll</Link>
					<Link to="/channels/new">Create new channel</Link>
					<PollOverview polls={renderedPolls} />
				</>
			)}
			{isModerator && (
				<>
					<h1>All polls</h1>
					<Form method="post">
						<button>Save current season and reset</button>
						<input
							type="hidden"
							name="season-reset"
							readOnly
							value="season-reset"
						/>
					</Form>
					<Filters setRenderedPolls={pollsFromSuggesters} />
					<Link to="/polls/new">Create new poll</Link>
					<Link to="/channels/new">Create new channel</Link>
					<PollOverview
						polls={[...pollsByUser, ...pollsFromSuggesters]}
					/>
				</>
			)}
			{!isAdmin && !isModerator && (
				<>
					{/* ! Optimize this in it;s own component later to reduce firebase reads */}
					{pollsByUser.length > 0 ? (
						<>
							<h1>Polls sent in by you</h1>
							<PollOverview polls={pollsByUser} />
						</>
					) : (
						<Title size="md" variant="primary">
							No polls from you here yet!
						</Title>
					)}
				</>
			)}
		</section>
	);
}
