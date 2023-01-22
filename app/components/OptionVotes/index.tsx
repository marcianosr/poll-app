import { PropsWithChildren } from "react";
import styles from "./styles.css";
import { Text } from "../../ui/Text";

export type OptionVotesProps = {
	voters: {
		photo: string;
	}[];
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const OptionVotes = ({
	voters,
	children,
}: PropsWithChildren<OptionVotesProps>) => {
	return (
		<section className="option-votes">
			<Text size="sm" variant="primary" tag="small">
				{children} votes
			</Text>
			<div className="option-voters">
				{voters.map((voter) => (
					<img src={voter.photo} alt="" width={30} height={30} />
				))}
			</div>
		</section>
	);
};
