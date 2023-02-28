import { TextAreaField as TextAreaFieldComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const Story: ComponentMeta<typeof TextAreaFieldComponent> = {
	component: TextAreaFieldComponent,
	title: "Components/TextAreaField",
	args: {
		placeholder: "Placeholder",
		name: "name",
		value: "",
		disabled: false,
		isValid: false,
	},
	argTypes: {},
};

export default Story;

const Template: ComponentStory<typeof TextAreaFieldComponent> = (props) => (
	<TextAreaFieldComponent {...props} />
);

export const TextAreaField = Template.bind({});
