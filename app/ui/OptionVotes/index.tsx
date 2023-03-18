import { PropsWithChildren, useState } from "react";
import styles from "./styles.css";
import { PhotoList } from "../PhotoList";

import { PhotoType } from "~/ui/Photo";
import { Text } from "../../ui/Text";
import { EggConditional } from "~/seasonal/Egg/EggContainer";
import { useLoaderData } from "@remix-run/react";
import { LoaderData } from "~/routes/polls/$id";
import { ToolTip } from "../Tooltip";

export type VoterType = {
	photo: PhotoType;
};

export type OptionVotesProps = {
	voters: VoterType[];
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

const LIMIT = 10;

export const OptionVotes = ({
	voters,
}: PropsWithChildren<OptionVotesProps>) => {
	const votersToShow = voters.slice(0, LIMIT);
	const additionalVoters = voters.slice(LIMIT);
	const allVoters = votersToShow.concat(additionalVoters);
	const { poll } = useLoaderData() as LoaderData;
	const [showTooltip, setShowTooltip] = useState(false);

	return (
		<section className="option-votes">
			<div
				className="option-voters"
				onMouseEnter={() => setShowTooltip(true)}
			>
				<PhotoList variant="chips" voters={votersToShow} />
			</div>

			{showTooltip && poll.category === "javascript" && (
				<div
					style={{
						position: "relative",
						top: "-102px",
						left: "-100%",
					}}
				>
					<ToolTip text="ASECRETISGUARANTEEDWHENTHELIMITOFVOTESEXCEED" />
				</div>
			)}

			{allVoters.length > LIMIT && (
				<EggConditional
					{...(poll.category === "javascript" && {
						category: "js",
					})}
					id="2"
					size="xl"
				/>
			)}
			{allVoters.length > LIMIT && (
				<Text variant="primary" size="sm">
					+ {additionalVoters.length} others voted
				</Text>
			)}
		</section>
	);
};
