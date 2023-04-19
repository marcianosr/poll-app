import { Select as SelectComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const Story: ComponentMeta<typeof SelectComponent> = {
	component: SelectComponent,
	title: "Components/Select",
	args: {
		options: ["Single value", "Multiple values"],
		name: "type",
		value: "radio",
	},
	argTypes: {},
};

export default Story;

const Template: ComponentStory<typeof SelectComponent> = (props) => (
	<SelectComponent {...props} />
);

export const Select = Template.bind({});

Select.args = {};
