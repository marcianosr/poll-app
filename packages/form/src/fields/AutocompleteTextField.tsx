import React from "react";
import type { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { z } from "zod";
import { useCustomField } from "../base-form/FieldContext";
import type { AutoCompleteTextField } from "@marcianosrs/form-schema";
import { transform } from "@marcianosrs/utils";
import { makeOptionalString } from "../schema/zodUtils";
import { FormField } from "@marcianosrs/ui";

const AutoCompleteInput = ({ ...props }) => {
	return (
		<>
			<input type="text" {...props}></input>
		</>
	);
};

const AutoCompleteTextField = ({
	field,
}: FormFieldProps<AutoCompleteTextField<string>>) => {
	const { register, errors } = useCustomField(field);
	return (
		<>
			<h1>Text field auto complete</h1>
			<FormField
				fieldTitle={<label>{field.displayName}</label>}
				fieldInput={<AutoCompleteInput {...register()} />}
				fieldErrors={
					<>
						{errors?.map((e, i) => (
							<p key={i}>{e}</p>
						))}
					</>
				}
			/>
		</>
	);
};

export const autoCompleteTextFieldPlugin: FormFieldPlugin<
	AutoCompleteTextField<string>,
	z.ZodString | z.ZodOptional<z.ZodString>
> = {
	fieldType: "autocomplete-text",
	Component: AutoCompleteTextField,
	Show: ({ value }) => value ?? null,
	toZodSchema: (field) =>
		transform(z.string().min(1))
			.apply(field.optional, makeOptionalString)
			.result(),
};
