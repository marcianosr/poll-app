import { InputField as InputFieldComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const Story: ComponentMeta<typeof InputFieldComponent> = {
	component: InputFieldComponent,
	title: "Components/InputField",
	args: {
		placeholder: "Placeholder",
		type: "text",
		name: "name",
		value: "",
		disabled: false,
		isValid: false,
	},
	argTypes: {},
};

export default Story;

const Template: ComponentStory<typeof InputFieldComponent> = (props) => (
	<InputFieldComponent {...props} />
);

export const InputField = Template.bind({});

InputField.args = {};
