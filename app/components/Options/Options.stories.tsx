import { Options as OptionsComponent } from ".";
import { Option as OptionComponent } from "../../ui/Option";
import { OptionVotes as OptionVotesComponent } from "../OptionVotes";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { OptionVotes } from "../OptionVotes";
import { largeAmountOfVoters } from "../../../.storybook/utils";

const Story: ComponentMeta<typeof OptionsComponent> = {
	component: OptionsComponent,
	title: "Components/Options",
	args: {},
	argTypes: {},
};

const answers = [
	{
		id: "eioozak-ojnab",
		placeholder: "Add option",
		autoFocus: false,
		type: "radio",
		value: "FuncA = never; FuncB = (a: number | string) => unknown;",
	},
	{
		autoFocus: false,
		id: "a8cbc46b-3f27-47be-a1d7-90fc4b97eaae",
		placeholder: "Add option",
		type: "radio",
		value: "FuncA and FuncB are both: (a: number | string) => unknown;",
	},
	{
		id: "fb6a9753-9499-4662-978b-249a9889d4d6",
		placeholder: "Add option",
		autoFocus: false,
		type: "radio",
		value: "This is invalid syntax: there should be parenthesis around the function signature on line 1",
	},
	{
		placeholder: "Add option",
		autoFocus: true,
		id: "97b3d256-ec8d-4740-892d-1b1d665cd65a",
		type: "radio",
		value: "FuncA = ((a: number) => unknown) | (a: string) => unknown);\nFuncB = (a: number | string) => unknown;",
	},
];

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
