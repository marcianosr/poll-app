import React from "react";
import { Title as TitleComponent } from ".";
// import { ComponentMeta, ComponentStory } from "@storybook/react";

const Story = {
	component: TitleComponent,
	title: "Elements/Title",
	args: {
		children: "Title",
	},
	argTypes: {},
};

export default Story;

export const Template = (props) => (
	<TitleComponent {...props}>{props.children}</TitleComponent>
);
