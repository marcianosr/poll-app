import React from "react";
import { Heading as HeadingComponent } from ".";
// import { ComponentMeta, ComponentStory } from "@storybook/react";

const Story = {
	component: HeadingComponent,
	title: "Elements/Heading",
	args: {
		children: "Heading",
	},
	argTypes: {},
};

export default Story;

export const Template = (props) => (
	<HeadingComponent {...props}>{props.children}</HeadingComponent>
);
