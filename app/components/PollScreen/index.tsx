import { Form, useActionData, useLoaderData } from "@remix-run/react";
import classNames from "classnames";
import { FC, useState } from "react";
import { useAuth } from "~/providers/AuthProvider";
import { LoaderData } from "~/routes/polls/$id";
import { Answer, Voted } from "~/utils/polls";
import VoteButton from "../Button/VoteButton";
import PollAnswerOption from "../PollAnswerOption";
import styles from "./styles.css";

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

type Props = {
	getCorrectAnswers: (answerId: string) => boolean;
	currentAnswers: Answer[];
	showVotedBy: boolean;
	getVotesFromAllUsers: any;
};

export const PollScreen: FC<Props> = ({
	showVotedBy,
	currentAnswers,
	getVotesFromAllUsers,
}) => {
	const { poll } = useLoaderData() as LoaderData;
	const { user, isAdmin } = useAuth();

	const action = useActionData();

	const [selectedVotes, setSelectedVotes] = useState<Voted[]>([]);

	return (
		<section
			className={classNames({
				"poll-is-closed": poll.status !== "open",
			})}
		>
			{poll.type === "radio" ? (
				<h3 className="notice">Only 1 answer can be selected</h3>
			) : (
				<h3 className="notice">Multiple can be selected</h3>
			)}
			<Form method="post">
				{action?.error && (
					<span>Please at least fill out one answer to submit</span>
				)}
				{user && (
					<ul className="choices-list">
						{currentAnswers.map((answer, idx: number) => (
							<PollAnswerOption
								idx={idx}
								answer={answer}
								poll={poll}
								selectedVotes={selectedVotes}
								setSelectedVotes={setSelectedVotes}
								showVotedBy={showVotedBy}
								getVotesFromAllUsers={getVotesFromAllUsers}
							/>
						))}
					</ul>
				)}
				{user && (
					<VoteButton poll={poll} selectedVotes={selectedVotes} />
				)}
				{!user && <small>Please login to submit your answer.</small>}
				<input
					type="hidden"
					name="answers"
					defaultValue={JSON.stringify(currentAnswers)}
				/>
				<input
					type="hidden"
					name="selectedVotes"
					defaultValue={JSON.stringify(selectedVotes)}
				/>
				<input
					type="hidden"
					name="uid"
					defaultValue={user?.firebase.id}
				/>
			</Form>
		</section>
	);
};
