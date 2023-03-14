import { BannerBlock, links as bannerBlockLinks } from "../../ui/BannerBlock";
import { Options, links as optionsLinks } from "../../ui/Options";
import { Option, links as optionLinks } from "../../ui/Option";
import { Banner, links as bannerLinks } from "../../ui/Banner";
import { Title, links as titleLinks } from "../../ui/Title";
import styles from "./styles.css";

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

export const YourVotes = ({ votes, getCorrectAnswers }: YourVotesProps) => {
	return (
		<section className="your-votes-block">
			<Title size="lg" tag="h2" variant="primary">
				Your votes
			</Title>
			<BannerBlock>
				<Banner size="wide" icon="🏋️">
					<Title size="md" variant="primary">
						Lift each other up: Feel free to discuss your vote in a
						slack thread!
					</Title>
				</Banner>
				<section>
					<Options>
						{votes.map((vote: any) => (
							<Option
								key={vote.id}
								answer={vote}
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
