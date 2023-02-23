import { PropsWithChildren } from "react";
import styles from "./styles.css";
import { PhotoList } from "../PhotoList";

import { PhotoType } from "~/ui/Photo";
import { Text } from "../../ui/Text";

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

	return (
		<section className="option-votes">
			<div className="option-voters">
				<PhotoList variant="chips" voters={votersToShow} />
			</div>
			{allVoters.length > LIMIT && (
				<Text variant="primary" size="sm">
					+ {additionalVoters.length} others voted
				</Text>
			)}
		</section>
	);
};
