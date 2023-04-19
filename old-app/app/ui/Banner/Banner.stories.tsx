import { Banner as BannerComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Title } from "../Title";

const Story: ComponentMeta<typeof BannerComponent> = {
	component: BannerComponent,
	title: "Components/Banner",
	args: {
		variant: "default",
		size: "default",
		children: "Only 1 answer can be selected",
		icon: false,
	},
	argTypes: {
		icon: {
			control: {
				type: "boolean",
			},
		},
	},
};

export default Story;

const Template: ComponentStory<typeof BannerComponent> = (props) => (
	<BannerComponent {...props} icon={props.icon && "🏋️"}>
		<Title size="md" variant="primary">
			{props.children}
		</Title>
	</BannerComponent>
);

export const Banner = Template.bind({});

Banner.args = {
	children: "27 votes on this poll",
};
