import { Form, useLoaderData } from "@remix-run/react";
import { FC, useState } from "react";
import { useAuth } from "~/providers/AuthProvider";
import { LoaderData } from "~/routes/polls/$id";
import { Banner } from "~/ui/Banner";
import { Title } from "~/ui/Title";
import { Answer, Voted } from "~/utils/polls";
import VoteButton from "../Button/VoteButton";
import { Options } from "../Options";
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
	const { user } = useAuth();

	const [selectedVotes, setSelectedVotes] = useState<Voted[]>([]);

	return (
		<section className="poll-screen">
			<Banner size="wide" icon="🚨">
				{poll.type === "radio" ? (
					<Title size="md" variant="primary" tag="span">
						Be careful! Only 1 answer is correct
					</Title>
				) : (
					<Title size="md" variant="primary" tag="span">
						Be careful! Multiple answers might be correct
					</Title>
				)}
			</Banner>
			<Form method="post">
				{user && (
					<Options>
						{currentAnswers.map((answer, idx: number) => (
							<PollAnswerOption
								key={idx}
								idx={idx}
								answer={answer}
								poll={poll}
								selectedVotes={selectedVotes}
								setSelectedVotes={setSelectedVotes}
								showVotedBy={showVotedBy}
								getVotesFromAllUsers={getVotesFromAllUsers}
							/>
						))}
					</Options>
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
