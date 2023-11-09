import React from "react";
import type { NumberField } from "@marcianosrs/form-schema";
import type { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { z } from "zod";
import { useCustomField } from "../base-form/FieldContext";
import { transform } from "@marcianosrs/utils";
import { FormField } from "@marcianosrs/ui";

const NumberField = ({ field }: FormFieldProps<NumberField<string>>) => {
	const { register, errors, fieldPathKey } = useCustomField(field);
	return (
		<FormField
			fieldTitle={
				<label htmlFor={fieldPathKey}>{field.displayName}</label>
			}
			fieldInput={
				<input
					id={fieldPathKey}
					type="number"
					{...(field.integerValue ? {} : { step: "0.01" })}
					{...register()}
				/>
			}
			fieldErrors={
				<>
					{errors?.map((e, i) => (
						<p key={i}>{e}</p>
					))}
				</>
			}
		/>
	);
};

export const numberFieldPlugin: FormFieldPlugin<
	NumberField<string>,
	z.ZodNumber | z.ZodOptional<z.ZodNumber>
> = {
	fieldType: "number",
	Component: NumberField,
	Show: ({ value }) => value ?? null,
	toZodSchema: (field) =>
		transform(z.coerce.number())
			.apply(field.max, (z, max) => z.max(max))
			.apply(field.min, (z, min) => z.min(min))
			.apply(field.optional, (z) => z.optional())
			.result(),
};
