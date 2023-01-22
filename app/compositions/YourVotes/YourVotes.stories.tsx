import { YourVotes as YourVotesComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const Story: ComponentMeta<typeof YourVotesComponent> = {
	component: YourVotesComponent,
	title: "Compositions/YourVotes",
	args: {},
	argTypes: {},
};

export default Story;

export const YourVotes: ComponentStory<typeof YourVotesComponent> = () => (
	<YourVotesComponent />
);
