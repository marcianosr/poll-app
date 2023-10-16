import React from "react";
import type { CheckboxField } from "@marcianosrs/form-schema";
import type { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { z } from "zod";
import { useCustomField } from "../base-form/FieldContext";
import { FormField } from "@marcianosrs/ui";
import { stringToBoolean } from "../schema/zodUtils";

const Checkbox = ({ field }: FormFieldProps<CheckboxField<string>>) => {
    const { register, errors } = useCustomField(field);
    return (
        <FormField
            fieldTitle={<label>{field.displayName}</label>}
            fieldInput={<input type="checkbox" {...register()} />}
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

export const checkboxPlugin: FormFieldPlugin<
    CheckboxField<string>,
    z.ZodBoolean
> = {
    fieldType: "checkbox",
    Component: Checkbox,
    Show: ({ value }) => (value ? <span>✅</span> : null),
    toZodSchema: () => stringToBoolean,
};
