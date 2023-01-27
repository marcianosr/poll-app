import { Text as TextComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const Story: ComponentMeta<typeof TextComponent> = {
	component: TextComponent,
	title: "Elements/Text",
	args: {
		size: "md",
		variant: "primary",
	},
	argTypes: {
		tag: {
			control: false,
		},
	},
};

export default Story;

const Template: ComponentStory<typeof TextComponent> = (props) => (
	<TextComponent {...props}>{props.children}</TextComponent>
);

export const PrimaryText = Template.bind({});
export const SecondaryText = Template.bind({});

PrimaryText.args = {
	children: "Voted less than 7 times in total",
};

SecondaryText.args = {
	children: "225",
};
