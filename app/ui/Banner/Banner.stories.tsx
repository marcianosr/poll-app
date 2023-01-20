import { Banner as BannerComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const Story: ComponentMeta<typeof BannerComponent> = {
	component: BannerComponent,
	title: "Components/Banner",
	args: {
		variant: "default",
		children: "Only 1 answer can be selected",
	},
	argTypes: {},
};

export default Story;

export const Banner: ComponentStory<typeof BannerComponent> = (props) => (
	<BannerComponent {...props}>{props.children}</BannerComponent>
);
