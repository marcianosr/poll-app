import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAllPollsWithIds, PollData } from "~/utils/polls";
import { PollStatistics } from ".";

export const loader: LoaderFunction = async ({ params }) => {
	const polls = await getAllPollsWithIds();

	return { polls };
};

export const getTotalPollsByCategory = (polls: PollData[]) =>
	polls.reduce((allPolls: Record<string, number>, poll: PollData) => {
		const currCount = allPolls[poll.category] ?? 0;

		return {
			...allPolls,
			[poll.category]: currCount + 1,
		};
	}, {});

export const PollStatisticsContainer = () => {
	const { polls } = useLoaderData<typeof loader>();

	return <PollStatistics polls={polls} />;
};
