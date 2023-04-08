import { PollStatus } from "~/utils/polls";
import styles from "./styles.css";

type PollStatusLabelProps = {
	status: PollStatus;
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

const statusEmoji = {
	open: "✅",
	closed: "⚠️",
	scheduled: "🆕",
	draft: "🚧",
};

export const PollStatusLabel = ({ status }: PollStatusLabelProps) => (
	<span className={status}>
		{status} {statusEmoji[status]}
	</span>
);
