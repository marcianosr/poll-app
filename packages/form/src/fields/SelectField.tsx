import React from "react";
import type { PickListField } from "@marcianosrs/form-schema";
import type { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { z } from "zod";
import { useCustomField } from "../base-form/FieldContext";

const SelectField = ({ field }: FormFieldProps<PickListField<string>>) => {
	const { register, errors } = useCustomField(field);

	console.log("field", field);
	return (
		<div>
			<div>{field.displayName}</div>
			<select {...register()}>
				{field.options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
			{errors?.map((e, i) => (
				<p key={i}>{e}</p>
			))}
		</div>
	);
};

export const selectFieldPlugin: FormFieldPlugin<
	PickListField<string>,
	z.ZodNumber | z.ZodOptional<z.ZodNumber>
> = {
	fieldType: "select",
	Component: SelectField,
	Show: ({ value }) => value ?? null,
	toZodSchema: (field) => {},
};
