import { ProfileCard as ProfileCardComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import users from "../../fixtures/users.json";

const Story: ComponentMeta<typeof ProfileCardComponent> = {
	component: ProfileCardComponent,
	title: "Components/ProfileCard",
	args: {
		user: users[0],
		points: 100,
	},
	argTypes: {},
};

export default Story;

export const ProfileCard: ComponentStory<typeof ProfileCardComponent> = (
	props
) => <ProfileCardComponent {...props} />;
