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

export type ResultsListProps = {
	voters: any;
	pollNumber: number;
	responses: number;
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
	return (
		<section className="results-list-container">
			<Title size="lg" tag="h2" variant="primary">
				Results for poll #{props.pollNumber}
			</Title>
			<Title size="md" tag="h2" variant="primary">
				🎉 {props.responses} votes!
			</Title>
			<section>
				<OptionsComponent {...props}>
					<OptionComponent id="test" variant="wrong">
						It is part of the EcmaScript Standard
						<OptionVotes voters={props.voters} />
					</OptionComponent>
					<OptionComponent id="test" variant="correct">
						ID's can only have a single level of specificity, while
						when using classes you can chain specificity
						<OptionVotes voters={props.voters} />
					</OptionComponent>
					<OptionComponent id="test">Option 2</OptionComponent>
					<OptionComponent id="test" variant="disabled">
						JavaScript is the same as TypeScript
						<OptionVotes voters={props.voters} />
					</OptionComponent>
					<OptionComponent id="test">
						ID's create scope, while classes do not
						<OptionVotes voters={props.voters} />
					</OptionComponent>
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
