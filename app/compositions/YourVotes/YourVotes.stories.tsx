import { YourVotes as YourVotesComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const Story: ComponentMeta<typeof YourVotesComponent> = {
	component: YourVotesComponent,
	title: "Compositions/YourVotes",
	args: {},
	argTypes: {},
};

export default Story;

const votes = [
	{
		blockType: "text",
		id: "0c1c10fa-0bac-48d6-9da7-44d98d192a50",
		placeholder: "Add option",
		autoFocus: false,
		type: "radio",
		value: "An ID is used for repeated elements like lists items to improve performance, classes are not unique",
	},
	{
		blockType: "text",
		id: "56ac32e4-2d4c-4a7b-906f-5f70758c5d0e",
		autoFocus: false,
		placeholder: "Add option",
		type: "radio",
		value: "ID's have a higher specificity than classes",
	},
];

export const YourVotes: ComponentStory<typeof YourVotesComponent> = () => (
	// <YourVotesComponent
	// 	votes={votes}
	// 	getCorrectAnswers={(string: string) => {
	// 		return true;
	// 	}}
	// />
);
