import { Award as AwardComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import users from "../../fixtures/users.json";

const Story: ComponentMeta<typeof AwardComponent> = {
	component: AwardComponent,
	title: "Components/Award",
	args: {
		title: "TypeScript Tinkerer",
		description: "Participated the most in TypeScript questions",
		winners: [users[2]],
		state: "default",
		variant: "text",
	},
};

export default Story;

const Template: ComponentStory<typeof AwardComponent> = (props) => (
	<AwardComponent {...props} />
);

export const Award = Template.bind({});
