import { FC } from "react";
import { PollData } from "~/utils/polls";
import { getTotalPollsByCategory } from "./Container";
import styles from "./styles.css";
import { Text } from "~/ui/Text";
import { Title } from "~/ui/Title";
import { useLoaderData } from "@remix-run/react";
import { LoaderData } from "~/routes/polls/$id";
import { EggConditional } from "~/seasonal/Egg/EggContainer";

type Props = { polls: PollData[] };

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const PollStatistics: FC<Props> = ({ polls }) => {
	const { poll } = useLoaderData() as LoaderData;
	return (
		<>
			<Title size="sm" variant="primary" tag="h3">
				All categories
			</Title>
			<ul className="categories-list">
				{Object.entries(getTotalPollsByCategory(polls)).map(
					([key, value]) => (
						<li className={`categories-list-item ${key}`} key={key}>
							{key} ({value})
						</li>
					)
				)}
				<hr />
				<Text size="lg" variant="rainbow" tag="span">
					{polls.length} total p
					<EggConditional
						{...(poll.category === "css" && { category: "css" })}
						fallbackValue="o"
						id="2"
						size="xs"
					/>
					lls
				</Text>
			</ul>
		</>
	);
};
