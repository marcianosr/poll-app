import React from "react";
import { FormField as FormFieldComponent } from ".";
import type { Meta, StoryObj } from "@storybook/react";
import { RangeSlider } from "../RangeSlider";

const meta: Meta<typeof FormFieldComponent> = {
    component: FormFieldComponent,
    title: "Components/FormField",
};

export default meta;

type Story = StoryObj<typeof FormFieldComponent>;

export const Primary: Story = {
    args: {
        fieldTitle: <span>Field name</span>, // Todo: Replace this wit a label component
        fieldInput: (
            <RangeSlider
                labels={[
                    { title: "Nothing", value: 0 },
                    { title: "All", value: 1 },
                ]}
                min={0}
                max={1}
                step={0.25}
            />
        ),
    },
};
