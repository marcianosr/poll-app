import { Options as OptionsComponent } from ".";
import { Option as OptionComponent } from "../../ui/Option";
import { OptionVotes as OptionVotesComponent } from "../OptionVotes";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { OptionVotes } from "../OptionVotes";
import {
	largeAmountOfVoters,
	smallAmountOfVoters,
} from "../OptionVotes/OptionVotes.stories";

const Story: ComponentMeta<typeof OptionsComponent> = {
	component: OptionsComponent,
	title: "Components/Options",
	args: {},
	argTypes: {},
};

export default Story;

export const Options: ComponentStory<typeof OptionsComponent> = (props) => {
	return (
		<OptionsComponent {...props}>
			<OptionComponent id="test">
				It is part of the EcmaScript Standard
				<OptionVotes voters={largeAmountOfVoters} />
			</OptionComponent>
			<OptionComponent id="test">
				Option 2
				<OptionVotes voters={largeAmountOfVoters} />
			</OptionComponent>
			<OptionComponent id="test">
				It is an API provided by the browser but has it’s own
				implementations in other environments
			</OptionComponent>
			<OptionComponent id="test">Option 4</OptionComponent>
			<OptionComponent id="test">
				it is a way to import any programming language In JavaScript
				<OptionVotes voters={smallAmountOfVoters} />
			</OptionComponent>
			<OptionComponent id="test">
				It is part of the general internet
			</OptionComponent>
			<OptionComponent id="test">Option 6</OptionComponent>
		</OptionsComponent>
	);
};
