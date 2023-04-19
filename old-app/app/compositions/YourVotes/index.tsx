import { BannerBlock, links as bannerBlockLinks } from "../BannerBlock";
import { Options, links as optionsLinks } from "../../ui/Options";
import {
	Option,
	links as optionLinks,
	OptionWithPoints,
} from "../../ui/Option";
import { Banner, links as bannerLinks } from "../../ui/Banner";
import { Title, links as titleLinks } from "../../ui/Title";
import styles from "./styles.css";
import { PENALTY_SCORE } from "~/routes/polls/$id";
import { Answer } from "~/utils/polls";
import { Fragment } from "react";

export type YourVotesProps = {
	votes: any;
	getCorrectAnswers: (answer: string) => boolean;
};

export function yourVoteStyles() {
	return [
		...titleLinks(),
		...optionsLinks(),
		...optionLinks(),
		...bannerLinks(),
		...bannerBlockLinks(),
		{ rel: "stylesheet", href: styles },
	];
}

const POINTS_MESSAGE: Record<number, { icon: string; message: string }> = {
	0: {
		icon: "🫠",
		message:
			"I don't want to sound dramatic, but your total score is quite static!",
	},
	1: {
		icon: "🤷🏻‍♂️",
		message: "A total score of 1, atleast better than none!",
	},
	2: {
		icon: "😐",
		message:
			"Don't complain, these points you earned are a pair, this is how it goes, only fair!",
	},
	3: {
		icon: "😤",
		message:
			"Your score is added up to 3, I'm sure you can do better you would agree!",
	},
	4: {
		icon: "❤️‍🩹",
		message:
			"4 points, a double pair of points you as can see, it's also slightly better than 3!",
	},
	5: {
		icon: "🤔",
		message:
			"An average score of 5, this competition is real, so these points are needed to survive!",
	},
	6: {
		icon: "🤐",
		message:
			"6 will get you somewhere, but it's not the score you want to share!",
	},
	7: {
		icon: "🍀",
		message:
			"7 is the lucky score, but your luck ends here because you won't get more!",
	},
	8: {
		icon: "😊",
		message:
			"The score is 8, a significant bigger total score for you my app will update!",
	},
	9: {
		icon: "🎉",
		message: "To 9 points I cheer 'wahey!', I don't know what else to say!",
	},
	10: {
		icon: "🤩",
		message:
			"A boot you'll put, with that huge score, to kick your colleagues butt!",
	},
};

export const YourVotes = ({ votes, getCorrectAnswers }: YourVotesProps) => {
	const totalPointsScored: number = votes
		.map((answer: Answer) =>
			!answer.points || answer.points === 0
				? PENALTY_SCORE
				: answer.points || 0
		) // when answer.points is not found (read: not set) in the DB, it should be 0
		.reduce((a: number, b: number) => a + b, 0); // this variable is the result of scored points minus the penalty points

	const totalPointsLeft: number =
		totalPointsScored < 0 ? 0 : totalPointsScored; // this is the result of the score, which can never go below 0

	return (
		<section className="your-votes-block">
			<Title size="lg" tag="h2" variant="primary">
				Your votes
			</Title>
			<BannerBlock>
				<Banner size="wide" icon={POINTS_MESSAGE[totalPointsLeft].icon}>
					<Title size="md" variant="primary">
						{POINTS_MESSAGE[totalPointsLeft].message}
					</Title>
				</Banner>
				<section>
					<Options>
						{votes.map((answer: Answer) => (
							<Fragment key={answer.id}>
								<Option
									answer={answer}
									points={answer.points || 0}
									variant={
										getCorrectAnswers(answer?.id || "")
											? "correct"
											: "wrong"
									}
								/>
								<OptionWithPoints points={answer.points || 0} />
							</Fragment>
						))}
					</Options>
				</section>
			</BannerBlock>
		</section>
	);
};
