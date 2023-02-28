import { FC } from "react";
import { useAuth } from "~/providers/AuthProvider";
import { CATEGORIES } from "~/utils/categories";
import { PollData, PollStatus } from "~/utils/polls";
import { Text } from "../../../ui/Text";
import styles from "./styles.css";

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

type PollSettingsContainerProps = {
	poll: PollData | undefined;
};

export const PollSettingsContainer: FC<PollSettingsContainerProps> = ({
	poll,
}) => {
	const { isAdmin } = useAuth();
	const pollStatus: PollStatus = (poll && poll?.status) || "new";
	// (poll && poll?.status) || isAdmin ? "new" : "needs-revision";

	return (
		<aside className="sidebar-settings-container">
			<div className="open-closed-toggle">
				<label htmlFor="status">
					<Text size="sm" variant="primary">
						{pollStatus !== "open"
							? "Not accepting responses"
							: "Accepting responses"}
					</Text>
				</label>

				{isAdmin ? (
					<select name="status" defaultValue={pollStatus}>
						<option value="open">open</option>
						<option value="closed">closed</option>
						<option value="needs-revision">needs revision</option>
						<option value="new">new</option>
					</select>
				) : (
					<select name="status" defaultValue={pollStatus}>
						<option value="needs-revision">needs revision</option>
					</select>
				)}
			</div>
			<select
				name="type"
				defaultValue={poll?.type === "radio" ? "radio" : "checkbox"}
			>
				<option value="radio">Single answer</option>
				<option value="checkbox">Multiple answers</option>
			</select>

			<select name="category" defaultValue={poll?.category}>
				{CATEGORIES.map((category) => (
					<option value={category}>{category}</option>
				))}
			</select>
		</aside>
	);
};
