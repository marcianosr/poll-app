import { BannerBlock as BannerBlockComponent } from ".";
import { Banner as BannerComponent } from "../../ui/Banner";
import { Options as OptionsComponent } from "../../ui/Options";
import { Option as OptionComponent } from "../../ui/Option";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Title } from "../../ui/Title";
import { answers } from "../../../.storybook/utils";

const Story: ComponentMeta<typeof BannerBlockComponent> = {
	component: BannerBlockComponent,
	title: "Compositions/BannerBlock",
	args: {
		children:
			"Lift each other up: Feel free to discuss your vote in a slack thread!",
	},
	argTypes: {},
};

export default Story;

export const BannerBlock: ComponentStory<typeof BannerBlockComponent> = (
	props
) => {
	return (
		<BannerBlockComponent {...props}>
			<BannerComponent icon="🏋️">
				<Title size="md" variant="primary">
					{props.children}
				</Title>
			</BannerComponent>
			<OptionsComponent {...props}>
				<OptionComponent answer={answers[0]} variant="wrong" />
				<OptionComponent answer={answers[1]} variant="correct" />
			</OptionsComponent>
		</BannerBlockComponent>
	);
};
