import React from "react";
import type { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { z } from "zod";
import type { Title } from "@marcianosrs/form-schema";

const TitleField = ({ field }: FormFieldProps<Title<string>>) => {
    return <h1>{field.displayName}</h1>;
};

export const titlePlugin: FormFieldPlugin<Title<string>, z.ZodNever> = {
    fieldType: "title",
    Component: TitleField,
    Show: () => null,
    toZodSchema: () => z.never(),
};
