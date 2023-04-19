import { Badge as BadgeComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const Story: ComponentMeta<typeof BadgeComponent> = {
	component: BadgeComponent,
	title: "Components/Badge",
	args: {},
};

export default Story;

const Template: ComponentStory<typeof BadgeComponent> = (props) => (
	<div style={{ position: "relative", top: "20px", left: 0 }}>
		<BadgeComponent />
	</div>
);

export const Badge = Template.bind({});

Badge.args = {};
