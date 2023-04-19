import { Link } from "@remix-run/react";
import classNames from "classnames";
import { FC } from "react";
import { useAuth } from "~/providers/AuthProvider";
import { transformToCodeTags } from "~/routes/polls/$id";
import { PollData } from "~/utils/polls";
import { SentByUserText } from "../../../components/SentByUserText";
import styles from "./styles.css";

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

type Props = {
	polls: PollData[];
};

export const PollOverview: FC<Props> = ({ polls }) => {
	const { isAdmin } = useAuth();

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
						<span className={classNames("label", poll.status)}>
							{poll.status}
						</span>
						{isAdmin && (
							<span>
								<Link to={`/polls/${poll.documentId}/edit`}>
									Edit
								</Link>
							</span>
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
