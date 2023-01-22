import { Banner as BannerComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Title } from "../Title";

const Story: ComponentMeta<typeof BannerComponent> = {
	component: BannerComponent,
	title: "Components/Banner",
	args: {
		children: "Only 1 answer can be selected",
	},
	argTypes: {
		icon: {
			control: {
				type: "inline-check",
			},
		},
	},
};

export default Story;

const Template: ComponentStory<typeof BannerComponent> = (props) => (
	<BannerComponent {...props}>
		<Title size="md" variant="primary">
			{props.children}
		</Title>
	</BannerComponent>
);

export const Banner = Template.bind({});

Banner.args = {
	children: "27 votes on this poll",
};

export const BannerWithIcon = Template.bind({});

BannerWithIcon.args = {
	icon: "🏋️",
	children: "Lift each other up! Discuss your vote in a slack thread!",
};
