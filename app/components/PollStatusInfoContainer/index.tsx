import { FC } from "react";
import styles from "./styles.css";
import { PollEdition, links as pollEditionLinks } from "../PollEdition";
import {
	PollStatusInfo,
	links as pollStatusInfoLinks,
} from "../PollStatusInfo";
import { PollStatus } from "~/utils/polls";

type Props = {
	status: PollStatus;
	openedPollNumber: number;
	pollNumber: number;
};

export function links() {
	return [
		...pollEditionLinks(),
		...pollStatusInfoLinks(),
		{ rel: "stylesheet", href: styles },
	];
}

export const PollStatusInfoContainer: FC<Props> = ({
	status,
	openedPollNumber,
	pollNumber,
}) => (
	<section>
		<PollEdition
			pollNumber={pollNumber}
			openedPollNumber={openedPollNumber}
		/>
		<PollStatusInfo status={status} />
	</section>
);
