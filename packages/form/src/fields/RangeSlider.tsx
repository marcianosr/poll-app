import React from "react";
import type { RangeSlider } from "@marcianosrs/form-schema";
import type { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { z } from "zod";
import { useCustomField } from "../base-form/FieldContext";
import {
	FormField,
	RangeSlider as RangeSliderUIComponent,
} from "@marcianosrs/ui";
import { transform } from "@marcianosrs/utils";

const RangeSlider = ({ field }: FormFieldProps<RangeSlider<string>>) => {
	const { register, errors, fieldPathKey } = useCustomField(field);
	const labels = [...field.labels];

	return (
		<FormField
			fieldTitle={
				<label htmlFor={fieldPathKey}>{field.displayName}</label>
			}
			fieldInput={
				<RangeSliderUIComponent
					id={fieldPathKey}
					{...register()}
					min={field.min}
					max={field.max}
					step={field.step}
					labels={labels}
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

export const rangeSliderPlugin: FormFieldPlugin<
	RangeSlider<string>,
	z.ZodNumber | z.ZodOptional<z.ZodNumber>
> = {
	fieldType: "range",
	Component: RangeSlider,
	Show: ({ value }) => value ?? null,
	toZodSchema: (field) =>
		transform(z.coerce.number())
			.apply(field.max, (z, max) => z.max(max))
			.apply(field.min, (z, min) => z.min(min))
			.apply(field.optional, (z) => z.optional())
			.result(),
};
