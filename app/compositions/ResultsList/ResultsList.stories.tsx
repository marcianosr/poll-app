import { ResultsList as ResultsListComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const Story: ComponentMeta<typeof ResultsListComponent> = {
	component: ResultsListComponent,
	title: "Compositions/ResultsList",
	args: {},
	argTypes: {},
};

const voters: any = [
	{
		photo: "https://lh3.googleusercontent.com/a-/AFdZucrnPlhUyyzfog376tJ3-XLM6j2Oi1cxMqtaVH0I=s96-c",
	},
	{
		photo: "https://lh3.googleusercontent.com/a-/AFdZucrnPlhUyyzfog376tJ3-XLM6j2Oi1cxMqtaVH0I=s96-c",
	},
];

export default Story;

export const ResultsList: ComponentStory<typeof ResultsListComponent> = () => (
	<ResultsListComponent voters={voters} responses={544} pollNumber={247} />
);
