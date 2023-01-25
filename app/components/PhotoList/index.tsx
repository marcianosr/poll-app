import { PropsWithChildren } from "react";
import styles from "./styles.css";
import classNames from "classnames";
import { Photo, PhotoType } from "../../ui/Photo";
import { VoterType } from "../OptionVotes";

export type PhotoListProps = {
	voters: VoterType[];
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const PhotoList = ({ voters }: PropsWithChildren<PhotoListProps>) => {
	const styles = classNames("photo-list");

	return (
		<ul className={styles}>
			{voters.map((voter) => (
				<li>
					<Photo photo={voter.photo} variant="round" size="small" />
				</li>
			))}
		</ul>
	);
};
