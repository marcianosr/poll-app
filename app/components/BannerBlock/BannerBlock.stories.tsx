import { BannerBlock as BannerBlockComponent } from ".";
import { Banner as BannerComponent } from "../../ui/Banner";
import { Options as OptionsComponent } from "../Options";
import { Option as OptionComponent } from "../../ui/Option";
import { OptionVotes as OptionVotesComponent } from "../OptionVotes";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { OptionVotes } from "../OptionVotes";
import { Title } from "../../ui/Title";

const Story: ComponentMeta<typeof BannerBlockComponent> = {
	component: BannerBlockComponent,
	title: "Components/BannerBlock",
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
			<section>
				<OptionsComponent {...props}>
					<OptionComponent id="test" variant="wrong">
						It is part of the EcmaScript Standard
					</OptionComponent>
					<OptionComponent id="test" variant="correct">
						Option 2
					</OptionComponent>
				</OptionsComponent>
			</section>
		</BannerBlockComponent>
	);
};
