import {
	PollStatusLabel,
	links as pollStatusLinks,
} from "../../ui/PollStatusLabel";
import { PollStatus } from "~/utils/polls";
import styles from "./styles.css";

type PollStatusInfoProps = {
	status: PollStatus;
};
export function links() {
	return [...pollStatusLinks(), { rel: "stylesheet", href: styles }];
}

export const PollStatusInfo = ({ status }: PollStatusInfoProps) => (
	<section className="poll-status-container">
		<span className="poll-status-text">Status:</span>
		<PollStatusLabel status={status} />
	</section>
);
