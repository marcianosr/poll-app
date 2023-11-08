import React from "react";
import type { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { z } from "zod";
import type { Description } from "@marcianosrs/form-schema";

const DescriptionField = ({ field }: FormFieldProps<Description<string>>) => {
	return <p>{field.displayName}</p>;
};

export const descriptionPlugin: FormFieldPlugin<
	Description<string>,
	z.ZodNever
> = {
	fieldType: "description",
	Component: DescriptionField,
	Show: () => null,
	toZodSchema: () => z.never(),
};
