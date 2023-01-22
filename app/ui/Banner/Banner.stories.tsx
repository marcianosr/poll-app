import { Banner as BannerComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Title } from "../Title";

const Story: ComponentMeta<typeof BannerComponent> = {
	component: BannerComponent,
	title: "Components/Banner",
	args: {
		children: "Only 1 answer can be selected",
	},
	argTypes: {},
};

export default Story;

export const Banner: ComponentStory<typeof BannerComponent> = (props) => (
	<BannerComponent {...props}>
		<Title size="md" variant="primary">
			{props.children}
		</Title>
	</BannerComponent>
);
