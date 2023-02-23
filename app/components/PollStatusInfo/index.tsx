import { FC } from "react";
import { PollStatus } from "../../utils/polls";
import styles from "./styles.css";
import { PollEdition, links as pollEditionLinks } from "../PollEdition";

type Props = {
	status: PollStatus;
	openedPollNumber: number;
	pollNumber: number;
};

export function links() {
	return [...pollEditionLinks(), { rel: "stylesheet", href: styles }];
}

export const PollStatusInfo: FC<Props> = ({
	status,
	openedPollNumber,
	pollNumber,
}) => (
	<section>
		<PollEdition
			pollNumber={pollNumber}
			openedPollNumber={openedPollNumber}
		/>
		<section className="poll-status-info">
			<span className="status">Status:</span>
			{status !== "open" ? (
				<span className="closed">Closed ⚠️</span>
			) : (
				<span className="open">Open ✅ </span>
			)}
		</section>
	</section>
);
