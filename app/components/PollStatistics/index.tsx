import { FC } from "react";
import { PollData } from "~/utils/polls";

type Props = { polls: PollData[] };

export const getTotalPollsByCategory = (polls: PollData[]) =>
	polls
		.filter((poll) => poll.category !== "miscellaneous")
		.reduce((allPolls: Record<string, number>, poll: PollData) => {
			const currCount = allPolls[poll.category] ?? 0;

			return {
				...allPolls,
				[poll.category]: currCount + 1,
			};
		}, {});

const PollStatistics: FC<Props> = ({ polls }) => (
	<ul>
		<h2>Poll statistieken:</h2>
		<h3>Totaal aantal polls in de volgende categorieën:</h3>
		{Object.entries(getTotalPollsByCategory(polls)).map(([key, value]) => (
			<li key={key}>
				{key} - {value}
			</li>
		))}
	</ul>
);

export default PollStatistics;
