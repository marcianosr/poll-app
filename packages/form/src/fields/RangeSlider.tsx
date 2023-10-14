import React from "react";
import type { RangeSlider } from "@marcianosrs/form-schema";
import type { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { z } from "zod";
import { useCustomField } from "../base-form/FieldContext";
import { RangeSlider as RangeSliderUIComponent } from "@marcianosrs/ui";

const RangeSlider = ({ field }: FormFieldProps<RangeSlider<string>>) => {
	const { register, errors } = useCustomField(field);
	const labels = [...field.labels];

	return (
		<div>
			<label>{field.displayName}</label>
			<RangeSliderUIComponent
				{...register()}
				min={field.min}
				max={field.max}
				step={field.step}
				list="values"
				labels={labels}
			/>

			{errors?.map((e, i) => (
				<p key={i}>{e}</p>
			))}
		</div>
	);
};

export const rangeSliderPlugin: FormFieldPlugin<
	RangeSlider<string>,
	z.ZodString | z.ZodOptional<z.ZodString>
> = {
	fieldType: "range",
	Component: RangeSlider,
	Show: ({ value }) => value ?? null,
	toZodSchema: () => z.string().min(1),
};
