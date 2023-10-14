import React from "react";
import type { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { z } from "zod";
import { useCustomField } from "../base-form/FieldContext";
import type { HiddenField } from "@marcianosrs/form-schema";

const HiddenField = ({ field }: FormFieldProps<HiddenField<string>>) => {
	const { register } = useCustomField(field);

	return <input type="hidden" {...register()} />;
};

export const hiddenFieldPlugin: FormFieldPlugin<
	HiddenField<string>,
	z.ZodString
> = {
	fieldType: "hidden",
	Component: HiddenField,
	Show: ({ value }) => value ?? null,
	toZodSchema: () => z.string().min(1),
};
