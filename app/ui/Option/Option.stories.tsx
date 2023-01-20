import { Option as OptionComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const Story: ComponentMeta<typeof OptionComponent> = {
	component: OptionComponent,
	title: "Components/Option",
	args: {
		variant: "default",
		children: "Option answer",
	},
	argTypes: {},
};

export default Story;

export const Option: ComponentStory<typeof OptionComponent> = (props) => (
	<OptionComponent {...props}>{props.children}</OptionComponent>
);
