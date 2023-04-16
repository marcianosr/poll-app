import { Form, Link, useSubmit } from "@remix-run/react";
import { FC } from "react";
import { useAuth } from "~/providers/AuthProvider";
import { transformToCodeTags } from "~/routes/polls/$id";
import { PollData } from "~/utils/polls";
import { SentByUserText } from "../../../components/SentByUserText";
import styles from "./styles.css";
import { Channel } from "~/utils/channels";

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

type Props = {
	polls: PollData[];
	channel?: Channel;
};

export const PollOverview: FC<Props> = ({ polls, channel }) => {
	const { isAdmin, isModerator, user } = useAuth();

	const submit = useSubmit();
	const isPollSubmittedByCurrentUser = (poll: PollData) =>
		poll.sentInByUser?.id === user?.uid;

	return (
		<ul>
			{polls.map((poll: PollData, idx: number) => (
				<li key={poll.id}>
					<section className="poll-status-number">
						<p>
							<strong>#{poll.pollNumber} - </strong>
							{transformToCodeTags(poll.question, idx)}
						</p>
					</section>
					<section className="poll-meta-info">
						{channel && (
							<Form method="post" action="/polls">
								<select
									name="poll-status"
									defaultValue={poll.status}
									onChange={(e) => {
										submit(
											{
												status: e.target.value,
												documentId:
													poll.documentId || "",
											},
											{
												method: "post",
												action: `/channels/${channel?.name}`,
											}
										);
									}}
								>
									<option value="open">open</option>
									<option value="closed">closed</option>
									<option value="scheduled">scheduled</option>
								</select>
							</Form>
						)}
						{(isAdmin ||
							isModerator ||
							isPollSubmittedByCurrentUser(poll)) && (
							<Link to={`/polls/${poll.documentId}/edit`}>
								Edit
							</Link>
						)}
						<Link to={`/polls/${poll.documentId}`}>Go to poll</Link>
						{poll.sentInByUser && (
							<SentByUserText
								name={poll.sentInByUser?.displayName}
							/>
						)}
					</section>
				</li>
			))}
		</ul>
	);
};
