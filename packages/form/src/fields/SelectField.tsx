import React from "react";
import type { FixedOption, PickListField } from "@marcianosrs/form-schema";
import type { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { z } from "zod";
import { useCustomField } from "../base-form/FieldContext";
import { transform } from "@marcianosrs/utils";

const SelectField = ({
    field,
}: FormFieldProps<PickListField<string, FixedOption[]>>) => {
    const { register, errors } = useCustomField(field);

    return (
        <div>
            <div>{field.displayName}</div>
            <select {...register()}>
                {field.options.map((option) => (
                    <option key={option.display} value={`${option.value}`}>
                        {option.display}
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
    PickListField<string, FixedOption[]>,
    z.ZodString | z.ZodOptional<z.ZodString>
> = {
    fieldType: "select",
    Component: SelectField,
    Show: ({ value }) => value ?? null,
    toZodSchema: (field) =>
        transform(z.string().min(1))
            .apply(field.optional, (z) => z.optional())
            .result(),
};
