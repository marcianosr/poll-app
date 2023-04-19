import { Question as QuestionComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const Story: ComponentMeta<typeof QuestionComponent> = {
	component: QuestionComponent,
	title: "Components/Question",
	args: {},
	argTypes: {},
};

export default Story;

export const Question: ComponentStory<typeof QuestionComponent> = (props) => (
	<QuestionComponent {...props}>{props.title}</QuestionComponent>
);

Question.args = {
	title: "Answer this question with no prepare, try it out if you dare!",
};
