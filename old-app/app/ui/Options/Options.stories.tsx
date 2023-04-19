import { Options as OptionsComponent } from ".";
import { Option as OptionComponent } from "../Option";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { OptionVotes } from "../OptionVotes";
import { answers, largeAmountOfVoters } from "../../../.storybook/utils";

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
			{answers.map((answer) => (
				<OptionComponent answer={answer}>
					<OptionVotes voters={largeAmountOfVoters} />
				</OptionComponent>
			))}
		</OptionsComponent>
	);
};
