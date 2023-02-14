import { OptionVotes, OptionVotes as OptionVotesComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import {
	smallAmountOfVoters,
	largeAmountOfVoters,
} from "../../../.storybook/utils";

const Story: ComponentMeta<typeof OptionVotesComponent> = {
	component: OptionVotesComponent,
	title: "Components/OptionVotes",
	args: {
		voters: smallAmountOfVoters,
	},
	argTypes: {},
};

export default Story;

const Template: ComponentStory<typeof OptionVotesComponent> = (props) => {
	return <OptionVotesComponent {...props}></OptionVotesComponent>;
};

export const OptionVotesSmall = Template.bind({});

OptionVotesSmall.args = {
	voters: smallAmountOfVoters,
};

export const OptionVotesLarge = Template.bind({});

OptionVotesLarge.args = {
	voters: largeAmountOfVoters,
};
