import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { awards } from "~/components/Awards";
import PollStatistics from "~/components/PollStatistics";
import { SentByUserText } from "~/components/SentByUserText";
import { useAuth } from "~/providers/AuthProvider";
import { createDevData, createKabisaPolls } from "~/utils/dev";
import {
	getAllPolls,
	getAllPollsWithIds,
	getDocumentPollIds,
	getPollsByOpeningTime,
	PollData,
	PollStatus,
	resetVotesForPoll,
} from "~/utils/polls";
import { createSeason, getAllSeasons, PollAwardData } from "~/utils/seasons";
import { getAdminUser, getUsers } from "~/utils/user";
import { transformToCodeTags } from "./$id";

type PollDataWithDocumentId = PollData & {
	documentId: string;
};

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
	const data = await getAllPolls();

	const ids = await getDocumentPollIds();

	// ! Enable when you want local DB population
	// await createDevData();
	// await createKabisaPolls();

	return { polls: data, docId: ids };
};

export default function AllPolls() {
	const { polls, docId } = useLoaderData();
	const { user, isAdmin } = useAuth();
	const [renderedPolls, setRenderedPolls] = useState(polls);
	const pollsByUser = polls.filter(
		(poll: PollData) =>
			poll.sentInByUser && poll?.sentInByUser.id === user?.firebase.id
	);

	const filterPollsByStatus = (category?: PollStatus) => {
		const filteredPolls = category
			? polls.filter((poll: PollData) => poll.status === category)
			: polls;
		setRenderedPolls(filteredPolls);
	};

	return (
		<section style={{ color: "white" }}>
			{isAdmin ? (
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
					<PollStatistics polls={polls} />

					<button type="button" onClick={() => filterPollsByStatus()}>
						All
					</button>
					<button
						type="button"
						onClick={() => filterPollsByStatus("new")}
					>
						New {}
					</button>
					<button
						type="button"
						onClick={() => filterPollsByStatus("needs-revision")}
					>
						Need revision
					</button>

					<Link to="/polls/new">Create new poll</Link>
					<ul>
						{renderedPolls.map((poll: PollData, idx: number) => (
							<li key={poll.id}>
								<p>
									#{poll.pollNumber} -{" "}
									{transformToCodeTags(poll.question, idx)}
								</p>
								{isAdmin && (
									<span>
										<span>{poll.status}</span>
										<Link to={`/polls/${docId[idx]}/edit`}>
											Edit
										</Link>
									</span>
								)}

								<Link to={`/polls/${docId[idx]}`}>
									Go to poll
								</Link>
								{poll.sentInByUser && (
									<SentByUserText
										name={poll.sentInByUser?.displayName}
									/>
								)}
							</li>
						))}
					</ul>
				</>
			) : (
				<>
					{/* ! Optimize this in it;s own component later to reduce firebase reads */}
					<h1>Polls sent in by you</h1>

					{pollsByUser.length > 0 ? (
						<ul>
							{pollsByUser.map((poll: PollData, idx: number) => (
								<li>
									<p>{poll.question}</p>
									<Link to={`/polls/${docId[idx]}`}>
										Go to poll
									</Link>
								</li>
							))}
						</ul>
					) : (
						<p>
							Awww... no polls send in by you <em>yet!</em>
						</p>
					)}

					{/* <h1>Your polls answered (coming soon 🚧)</h1> */}
				</>
			)}
		</section>
	);
}
