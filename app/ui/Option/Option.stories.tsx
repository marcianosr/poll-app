import { Option as OptionComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const Story: ComponentMeta<typeof OptionComponent> = {
	component: OptionComponent,
	title: "Components/Option",
	args: {
		variant: "default",
		answer: {
			value: "option 1",
			id: "banjo-kazooie",
		},
	},
	argTypes: {},
};

export default Story;

export const Option: ComponentStory<typeof OptionComponent> = (props) => (
	<OptionComponent {...props}>{props.children}</OptionComponent>
);
