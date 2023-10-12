import React from "react";
import { Button as ButtonComponent } from ".";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ButtonComponent> = {
  component: ButtonComponent,
  title: "Components/Button",
};

export default meta;

type Story = StoryObj<typeof ButtonComponent>;

export const Primary: Story = {
  args: {
    children: "Submit",
  },
};
