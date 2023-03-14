import { ToolTip as ToolTipComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const Story: ComponentMeta<typeof ToolTipComponent> = {
	component: ToolTipComponent,
	title: "Components/ToolTip",
	args: {
		title: "About container queries",
		text: "Container queries enable you to apply styles to an element based on the size of the element's container. If, for example, a container has less space available in the surrounding context, you can hide certain elements or use smaller fonts. Container queries are an alternative to media queries, which apply styles to elements based on viewport size or other device characteristics.",
	},
	argTypes: {},
};

export default Story;

const Template: ComponentStory<typeof ToolTipComponent> = (props) => (
	<ToolTipComponent {...props} />
);

export const ToolTip = Template.bind({});
