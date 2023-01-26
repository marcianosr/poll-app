import {
	BannerBlock,
	links as bannerBlockLinks,
} from "../../components/BannerBlock";
import { Options, links as optionsLinks } from "../../components/Options";
import { Option, links as optionLinks } from "../../ui/Option";
import { Banner, links as bannerLinks } from "../../ui/Banner";
import { Title, links as titleLinks } from "../../ui/Title";
import styles from "./styles.css";
import { Options as OptionsComponent } from "../../components/Options";
import { Option as OptionComponent } from "../../ui/Option";
import { OptionVotes } from "../../components/OptionVotes";
import { useLoaderData } from "@remix-run/react";
import { LoaderData } from "../../routes/polls/$id";
import { Answer } from "../../utils/polls";
import { useAuth } from "../../providers/AuthProvider";

export type ResultsListProps = {
	currentAnswers: Answer[];
	getCorrectAnswers: (answerId: string) => boolean;
	getGivenVotesByUser: any;
};

export function resultsListStyles() {
	return [
		// ...titleLinks(),
		// ...optionsLinks(),
		// ...optionLinks(),
		// ...bannerLinks(),
		// ...bannerBlockLinks(),
		{ rel: "stylesheet", href: styles },
	];
}

export const ResultsList = (props: ResultsListProps) => {
	const { poll, responses, openedPollNumber } = useLoaderData() as LoaderData;

	const getLengthOfAnswersById = (answerId: string) =>
		poll.voted.filter((voted) => voted.answerId === answerId);

	return (
		<section className="results-list-container">
			<Title size="lg" tag="h2" variant="primary">
				Results for poll #{openedPollNumber}
			</Title>
			<Title size="md" tag="h2" variant="primary">
				🎉 {responses} votes!
			</Title>
			<section>
				<OptionsComponent {...props}>
					{props.currentAnswers.map((answer: Answer) => {
						const variant = props.getCorrectAnswers(answer.id)
							? "correct"
							: props.getGivenVotesByUser.find(
									(vote) => vote?.id === answer.id
							  )
							? "selected"
							: "disabled";

						return (
							<OptionComponent id="test" variant={variant}>
								{answer.value}

								{/* <OptionVotes voters={[]} /> */}
							</OptionComponent>
						);
					})}
				</OptionsComponent>
			</section>
		</section>
	);
};
{
	/* <>
							
<Option id="test" variant="wrong">
	It is part of the EcmaScript Standard
</Option>
<Option id="test" variant="correct">
	Option 2
</Option>
</> */
}
