import { FC } from "react";
import { PollStatus } from "../../utils/polls";
import styles from "./styles.css";

type Props = {
	status: PollStatus;
	openedPollNumber: number;
	pollNumber: number;
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const PollStatusInfo: FC<Props> = ({
	status,
	openedPollNumber,
	pollNumber,
}) => (
	<section>
		<div className="poll-title-container">
			<h2 className="poll-status-title">Poll #{openedPollNumber}</h2>
			<small>(No. {pollNumber})</small>
		</div>
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
