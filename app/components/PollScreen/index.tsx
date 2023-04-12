import { Form, useLoaderData } from "@remix-run/react";
import { FC, useState } from "react";
import { useAuth } from "~/providers/AuthProvider";
import { LoaderData } from "~/routes/polls/$id";
import { Answer, InputTypes, Voted } from "~/utils/polls";
import VoteButton from "../Button/VoteButton";
import { Options } from "../../ui/Options";
import PollAnswerOption from "../PollAnswerOption";
import { WarningBanner } from "../../ui/WarningBanner";
import styles from "./styles.css";
import { Banner } from "~/ui/Banner";
import { Title } from "~/ui/Title";

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

type Props = {
	getCorrectAnswers: (answerId: string) => boolean;
	currentAnswers: Answer[];
	showVotedBy: boolean;
	getVotesFromAllUsers: any;
	openedPollNumber: number;
};

export const PollScreen: FC<Props> = ({
	showVotedBy,
	currentAnswers,
	getVotesFromAllUsers,
	openedPollNumber,
}) => {
	const { poll } = useLoaderData() as LoaderData;
	const { user } = useAuth();

	const totalPoints = poll.answers.reduce((acc: number, answer: any) => {
		return acc + (answer.points || 0);
	}, 0);

	const [selectedVotes, setSelectedVotes] = useState<Voted[]>([]);

	return (
		<section className="poll-screen">
			<WarningBanner pollType={poll.type as InputTypes} />
			{!user && <small>Please login to submit your answer.</small>}

			{user && (
				<>
					<Form method="post" className="form">
						<Banner size="wide">
							<Title size="md-sm" variant="primary">
								{totalPoints} points can be earned for this poll
							</Title>
						</Banner>
						<Options>
							{currentAnswers.map((answer, idx: number) => (
								<PollAnswerOption
									key={answer.id}
									idx={idx}
									answer={answer}
									poll={poll}
									selectedVotes={selectedVotes}
									setSelectedVotes={setSelectedVotes}
									showVotedBy={showVotedBy}
									getVotesFromAllUsers={getVotesFromAllUsers}
									user={user}
								/>
							))}
						</Options>
						<VoteButton poll={poll} selectedVotes={selectedVotes} />
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
							defaultValue={user.firebase.id}
						/>
						<input
							type="hidden"
							name="openedPollNumber"
							defaultValue={openedPollNumber}
						/>
					</Form>
				</>
			)}
		</section>
	);
};
