import { ResultsList as ResultsListComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { largeAmountOfVoters } from "../../components/OptionVotes/OptionVotes.stories";

const Story: ComponentMeta<typeof ResultsListComponent> = {
	component: ResultsListComponent,
	title: "Compositions/ResultsList",
	args: {},
	argTypes: {},
};

export default Story;

export const ResultsList: ComponentStory<typeof ResultsListComponent> = () => (
	<ResultsListComponent
		voters={largeAmountOfVoters}
		responses={544}
		pollNumber={247}
	/>
);
