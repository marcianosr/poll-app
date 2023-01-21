import { Button as ButtonComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const Story: ComponentMeta<typeof ButtonComponent> = {
	component: ButtonComponent,
	title: "Components/Button",
	args: {
		children: "Highest total this season",
	},
	argTypes: {
		type: {
			control: false,
		},
		name: {
			control: false,
		},
		value: {
			control: false,
		},
		state: {
			control: {
				type: "inline-check",
			},
			defaultValue: false,
		},
	},
};

export default Story;

const Template: ComponentStory<typeof ButtonComponent> = (props) => (
	<ButtonComponent {...props}>{props.children}</ButtonComponent>
);

export const Button = Template.bind({});

Button.args = {
	children: "Highest total this season",
};
