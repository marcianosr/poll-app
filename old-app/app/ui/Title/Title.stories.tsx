import { Title as TitleComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const Story: ComponentMeta<typeof TitleComponent> = {
	component: TitleComponent,
	title: "Elements/Title",
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

const Template: ComponentStory<typeof TitleComponent> = (props) => (
	<TitleComponent {...props}>{props.children}</TitleComponent>
);

export const PrimaryTitle = Template.bind({});
export const SecondaryTitle = Template.bind({});

PrimaryTitle.args = {
	children: "Answer this question with no prepare, try it out if you dare!",
};

SecondaryTitle.args = {
	children: "Teams",
};
