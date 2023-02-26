import { PollStatusLabel as PollStatusLabelComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import users from "../../fixtures/users.json";

const Story: ComponentMeta<typeof PollStatusLabelComponent> = {
	component: PollStatusLabelComponent,
	title: "Components/PollStatusLabel",
	args: {
		status: "open",
	},
	argTypes: {},
};

export default Story;

export const PollStatusLabel: ComponentStory<
	typeof PollStatusLabelComponent
> = (props) => <PollStatusLabelComponent {...props} />;
