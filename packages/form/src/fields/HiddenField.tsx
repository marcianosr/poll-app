import React from "react";
import type { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { z } from "zod";
import { useCustomField } from "../base-form/FieldContext";
import type { HiddenField } from "@marcianosrs/form-schema";
import { transform } from "@marcianosrs/utils";
import { makeOptionalString } from "../schema/zodUtils";

const HiddenField = ({ field }: FormFieldProps<HiddenField<string>>) => {
	const { register } = useCustomField(field);

	return <input type="hidden" {...register()} />;
};

export const hiddenFieldPlugin: FormFieldPlugin<
	HiddenField<string>,
	z.ZodString | z.ZodOptional<z.ZodString>
> = {
	fieldType: "hidden",
	Component: HiddenField,
	Show: () => null,
	toZodSchema: (field) =>
		transform(z.string().min(1))
			.apply(field.optional, makeOptionalString)
			.result(),
};
