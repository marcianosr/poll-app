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
			<OptionComponent
				id="test"
				text="
				It is part of the EcmaScript Standard"
			>
				<OptionVotes voters={largeAmountOfVoters} />
			</OptionComponent>
			<OptionComponent
				id="test"
				text="
				Option 2
"
			>
				<OptionVotes voters={largeAmountOfVoters} />
			</OptionComponent>
			<OptionComponent
				id="test"
				text="
				It is an API provided by the browser but has it’s own
				implementations in other environments"
			/>
			<OptionComponent
				id="test"
				text="
				Option 4
				"
			/>
			<OptionComponent
				id="test"
				text="
				It is a way to import any programming language In JavaScript"
			>
				<OptionVotes voters={smallAmountOfVoters} />
			</OptionComponent>
			<OptionComponent
				id="test"
				text="
				It is part of the general internet
				"
			/>
			<OptionComponent
				id="test"
				text="
				Option 5"
			/>
		</OptionsComponent>
	);
};
