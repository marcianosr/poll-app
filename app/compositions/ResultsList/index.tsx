import { links as optionsLinks } from "../../ui/Options";
import { links as photoLinks } from "../../ui/Photo";
import { links as photoListLinks } from "../../ui/PhotoList";
import { Title } from "../../ui/Title";
import { Options } from "../../ui/Options";
import { Option } from "../../ui/Option";
import { OptionVotes, links as optionVotesLinks } from "../../ui/OptionVotes";
import { useLoaderData } from "@remix-run/react";
import { LoaderData } from "../../routes/polls/$id";
import { Answer } from "../../utils/polls";
import styles from "./styles.css";
import {
	OptionExplanation,
	links as optionExplanationLinks,
} from "../OptionExplanation";
import { useState } from "react";

export type ResultsListProps = {
	currentAnswers: Answer[];
	getCorrectAnswers: (answerId: string) => boolean;
	getGivenVotesByUser: any;
	getVotesFromAllUsers: any;
};

export function resultsListStyles() {
	return [
		...photoListLinks(),
		...photoLinks(),
		...optionsLinks(),
		...optionVotesLinks(),
		...optionExplanationLinks(),
		{ rel: "stylesheet", href: styles },
	];
}

export const ResultsList = (props: ResultsListProps) => {
	const { responses, openedPollNumber } = useLoaderData() as LoaderData;
	const [showTooltip, setShowTooltip] = useState<string | null>(null);
	const openTooltip = (id: string) => setShowTooltip(id);
	const closeTooltip = () => setShowTooltip(null);

	return (
		<>
			<Title size="md" tag="h2" variant="primary">
				Results for poll #{openedPollNumber}
			</Title>
			<section className="results">
				<Title size="md" tag="h2" variant="primary">
					🎉 {responses} votes!
				</Title>
				<section>
					<Options {...props}>
						{props.currentAnswers.map((answer: Answer) => {
							const variant = props.getCorrectAnswers(answer.id)
								? "correct"
								: props.getGivenVotesByUser.find(
										(vote) => vote?.id === answer.id
								  )
								? "selected"
								: "disabled";

							return answer.explanation?.value ? (
								<OptionExplanation
									tooltip={{
										id: answer.id,
										open: showTooltip,
										setOpen: () => openTooltip(answer.id),
										onClose: () => closeTooltip(),
										title: "More info about this answer",
										text: answer.explanation.value,
									}}
								>
									{({ open, setOpen }) => {
										return (
											<Option
												answer={answer}
												variant={variant}
												key={answer.id}
												onClick={() => setOpen(open)}
											>
												<OptionVotes
													voters={props
														.getVotesFromAllUsers(
															answer.id
														)
														.map((user) => ({
															photo: {
																url: user.photoURL,
															},
														}))}
												/>
											</Option>
										);
									}}
								</OptionExplanation>
							) : (
								<Option
									answer={answer}
									variant={variant}
									key={answer.id}
								>
									<OptionVotes
										voters={props
											.getVotesFromAllUsers(answer.id)
											.map((user) => ({
												photo: {
													url: user.photoURL,
												},
											}))}
									/>
								</Option>
							);
						})}
					</Options>
				</section>
			</section>
		</>
	);
};
