import { useLoaderData } from "@remix-run/react";
import { FC } from "react";
import { PollCategory, CATEGORIES } from "~/utils/categories";
import { PollData, PollStatus } from "~/utils/polls";

type FilterProps = {
	setRenderedPolls: (polls: PollData[]) => void;
};

type AmountOfPollsDisplayProps = {
	polls: PollData[];
	status: PollStatus;
};

const statusses: PollStatus[] = ["new", "needs-revision", "open"];

export const Filters: FC<FilterProps> = ({ setRenderedPolls }) => {
	const { polls } = useLoaderData();

	const filterPollsByStatus = (category?: PollStatus) => {
		const filteredPolls = category
			? polls.filter((poll: PollData) => poll.status === category)
			: polls;
		setRenderedPolls(filteredPolls);
	};

	const filterPollsByCategory = (category?: PollCategory) => {
		const filteredPolls = category
			? polls.filter((poll: PollData) => poll.category === category)
			: polls;
		setRenderedPolls(filteredPolls);
	};

	return (
		<>
			<section>
				<button type="button" onClick={() => filterPollsByStatus()}>
					All
				</button>
				{statusses.map((status) => (
					<button
						type="button"
						onClick={() => filterPollsByStatus(status)}
					>
						{status}{" "}
						<AmountOfPollsDisplay polls={polls} status={status} />
					</button>
				))}
			</section>

			<section>
				{CATEGORIES.map((category) => (
					<>
						<button
							type="button"
							onClick={() => filterPollsByCategory(category)}
						>
							{category}
						</button>
					</>
				))}
			</section>
		</>
	);
};

const AmountOfPollsDisplay: FC<AmountOfPollsDisplayProps> = ({
	polls,
	status,
}) => <>({polls.filter((poll: PollData) => poll.status === status).length})</>;
