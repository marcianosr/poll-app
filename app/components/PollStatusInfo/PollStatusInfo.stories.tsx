import { PollStatusInfo as PollStatusInfoComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const Story: ComponentMeta<typeof PollStatusInfoComponent> = {
	component: PollStatusInfoComponent,
	title: "Components/PollStatusInfo",
	args: {
		status: "open",
	},
	argTypes: {},
};

export default Story;

export const PollStatusInfo: ComponentStory<typeof PollStatusInfoComponent> = (
	props
) => <PollStatusInfoComponent {...props} />;
