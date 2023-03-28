import { BannerBlock, links as bannerBlockLinks } from "../BannerBlock";
import { Options, links as optionsLinks } from "../../ui/Options";
import { Option, links as optionLinks } from "../../ui/Option";
import { Banner, links as bannerLinks } from "../../ui/Banner";
import { Title, links as titleLinks } from "../../ui/Title";
import styles from "./styles.css";
import { PENALTY_SCORE } from "~/routes/polls/$id";

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
			"Don't complain, these points you earned are now a pair, this is how it goes, only fair!",
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
			"Lucky 7 is the score, sadly the luck ends, because you won't get more!",
	},
	8: {
		icon: "😊",
		message: "The score is 8, a bigger total score you will update!",
	},
	9: {
		icon: "🎉",
		message: "To 9 points I cheer 'wahey!', I don't know what else to say!",
	},
	10: {
		icon: "🤩",
		message:
			"Maximum score, a boot you'll put, to score and kick your colleagues butt!",
	},
};

export const YourVotes = ({ votes, getCorrectAnswers }: YourVotesProps) => {
	const points: number = votes
		.map((vote: any) => (vote.points === 0 ? PENALTY_SCORE : vote.points))
		.reduce((a: number, b: number) => a + b, 0);
	const totalPoints: number = points < 0 ? 0 : points;

	return (
		<section className="your-votes-block">
			<Title size="lg" tag="h2" variant="primary">
				Your votes
			</Title>
			<BannerBlock>
				<Banner size="wide" icon={POINTS_MESSAGE[totalPoints].icon}>
					<Title size="md" variant="primary">
						{POINTS_MESSAGE[totalPoints].message}
					</Title>
				</Banner>
				<section>
					<Options>
						{votes.map((vote: any) => (
							<Option
								key={vote.id}
								answer={vote}
								points={vote.points}
								variant={
									getCorrectAnswers(vote?.id || "")
										? "correct"
										: "wrong"
								}
							/>
						))}
					</Options>
				</section>
			</BannerBlock>
		</section>
	);
};
