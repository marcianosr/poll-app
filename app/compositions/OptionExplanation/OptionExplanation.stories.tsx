import { OptionExplanation as OptionExplanationComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Option } from "../../ui/Option";

const Story: ComponentMeta<typeof OptionExplanationComponent> = {
	component: OptionExplanationComponent,
	title: "Compositions/OptionExplanation",
	args: {
		tooltip: {
			id: "1",
			open: "1",
			onClose: () => null,
			setOpen: () => null,
			title: "About container queries",
			text: "Container queries enable you to apply styles to an element based on the size of the element's container. If, for example, a container has less space available in the surrounding context, you can hide certain elements or use smaller fonts. Container queries are an alternative to media queries, which apply styles to elements based on viewport size or other device characteristics.",
		},
		children: (props) => (
			<Option
				answer={{ id: "", value: "Een antwoord over CSS" }}
				variant="correct"
				onClick={() => props.setOpen("1")}
			/>
		),
	},
	argTypes: {},
};

export default Story;

const Template: ComponentStory<typeof OptionExplanationComponent> = (props) => (
	<section
		style={{
			display: "flex",
			justifyContent: "center",
			marginTop: "300px",
		}}
	>
		<OptionExplanationComponent {...props} />
	</section>
);

export const OptionExplanation = Template.bind({});
