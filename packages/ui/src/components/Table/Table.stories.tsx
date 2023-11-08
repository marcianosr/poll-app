import React from "react";
import { Table as TableComponent } from ".";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button";

const meta: Meta<typeof TableComponent> = {
    component: TableComponent,
    title: "Components/Table",
};

export default meta;

type Story = StoryObj<typeof TableComponent<{ firstName: string, lastName: string}>>;

export const TableStory: Story = {
    args: {
        data: [
            { firstName: "Harry", lastName: "Potter" },
            { firstName: "Ron", lastName: "Weasley" },
            { firstName: "Draco", lastName: "Malfoy" },
        ],
        headers: ["First Name", "Last Name", null],
        mapDataToRow: ({ firstName, lastName }) => ({
            cells: [
                firstName,
                lastName,
                <>
                    <Button>Edit</Button>
                </>,
            ]
        }),
    },
};
