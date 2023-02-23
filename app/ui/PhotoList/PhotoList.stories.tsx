import { PhotoList as PhotoListComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import users from "../../fixtures/users.json";

const Story: ComponentMeta<typeof PhotoListComponent> = {
	component: PhotoListComponent,
	title: "Components/PhotoList",
	args: {
		variant: "default",
	},
	argTypes: {},
};

export default Story;

export const PhotoList: ComponentStory<typeof PhotoListComponent> = (props) => (
	<PhotoListComponent {...props} />
);

PhotoList.args = {
	voters: users.map((user) => ({ photo: { url: user.photoURL } })),
};
