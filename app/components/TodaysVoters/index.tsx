import classNames from "classnames";
import { PollData } from "~/utils/polls";
import styles from "./styles.css";

type Props = {
	poll: PollData;
	users: any;
	getCorrectAnswers: (answerId: string) => boolean;
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const TodaysVoters = ({ poll, users, getCorrectAnswers }: Props) => {
	const getVotersFromToday = poll.voted
		.map((vote) => ({
			...users.find((user) => user.id === vote.userId),
			vote,
		}))
		.map((user) => {
			const correctAnswer = getCorrectAnswers(user.vote.answerId);

			return (
				<li
					className={classNames("vote-order-list-item", {
						userCorrect: correctAnswer,
						userIncorrect: !correctAnswer,
					})}
				>
					<img src={user.photoURL} width={65} height={65} />
				</li>
			);
		});

	return (
		<>
			{getVotersFromToday.length > 0 && (
				<aside className="vote-order-sidebar">
					<ol className="vote-order-container">
						<span className="vote-order-title">Today's voters</span>
						{getVotersFromToday}
					</ol>
				</aside>
			)}
		</>
	);
};

export default TodaysVoters;
