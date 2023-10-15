import React from "react";
import type { CheckboxField } from "@marcianosrs/form-schema";
import type { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { z } from "zod";
import { useCustomField } from "../base-form/FieldContext";

const Checkbox = ({ field }: FormFieldProps<CheckboxField<string>>) => {
	const { register, errors } = useCustomField(field);
	return (
		<div>
			<label>{field.displayName}</label>
			<input type="checkbox" {...register()} />
			{errors?.map((e, i) => (
				<p key={i}>{e}</p>
			))}
		</div>
	);
};

export const checkboxPlugin: FormFieldPlugin<
	CheckboxField<string>,
	z.ZodBoolean
> = {
	fieldType: "checkbox",
	Component: Checkbox,
	Show: ({ value }) => (value ? <span>✅</span> : null),
	toZodSchema: () => z.boolean(),
};
