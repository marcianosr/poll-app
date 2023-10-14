import React from "react";
import { RangeSlider as RangeSliderComponent } from ".";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof RangeSliderComponent> = {
	component: RangeSliderComponent,
	title: "Components/RangeSlider",
};

export default meta;

type Story = StoryObj<typeof RangeSliderComponent>;

export const RangeSliderStory: Story = {
	args: {
		min: 0,
		max: 3,
		step: 1,
		labels: [
			{ title: "Easy", value: 1 },
			{ title: "Medium", value: 2 },
			{ title: "Hard", value: 3 },
		],
	},
};
