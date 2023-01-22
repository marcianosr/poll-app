import { OptionVotes as OptionVotesComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const voters = [
	{
		photo: "https://lh3.googleusercontent.com/a-/AFdZucrnPlhUyyzfog376tJ3-XLM6j2Oi1cxMqtaVH0I=s96-c",
	},
	{
		photo: "https://lh3.googleusercontent.com/a-/AFdZucrnPlhUyyzfog376tJ3-XLM6j2Oi1cxMqtaVH0I=s96-c",
	},
	{
		photo: "https://lh3.googleusercontent.com/a-/AFdZucrnPlhUyyzfog376tJ3-XLM6j2Oi1cxMqtaVH0I=s96-c",
	},
];

const Story: ComponentMeta<typeof OptionVotesComponent> = {
	component: OptionVotesComponent,
	title: "Components/OptionVotes",
	args: {
		voters,
	},
	argTypes: {},
};

export default Story;

export const OptionVotes: ComponentStory<typeof OptionVotesComponent> = (
	props
) => {
	return <OptionVotesComponent {...props}></OptionVotesComponent>;
};
