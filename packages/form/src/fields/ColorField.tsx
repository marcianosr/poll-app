import React from "react";
import { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { ColorField } from "../types/field-types";
import { z } from "zod";
import { useCustomField } from "../base-form/FieldContext";

const ColorField = ({ field, errors }: FormFieldProps<ColorField<string>>) => {
	const { register } = useCustomField(field);
	return (
		<>
			<label>{field.displayName}</label>
			<input type="color" {...register()} />
			{errors?.map((e, i) => (
				<p key={i}>{e}</p>
			))}
		</>
	);
};

export const colorFieldPlugin: FormFieldPlugin<
	ColorField<string>,
	z.ZodString | z.ZodOptional<z.ZodString>
> = {
	fieldType: "color",
	Component: ColorField,
	Show: ({ value }) => value ?? null,
	toZodSchema: () => z.string().min(1),
};
