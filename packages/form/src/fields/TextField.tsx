import React from "react";
import type { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { z } from "zod";
import { useCustomField } from "../base-form/FieldContext";
import type { TextField } from "@marcianosrs/form-schema";
import { transform } from "@marcianosrs/utils";
import { makeOptionalString } from "../schema/zodUtils";
import { FormField } from "@marcianosrs/ui";

const TextField = ({ field }: FormFieldProps<TextField<string>>) => {
    const { register, errors } = useCustomField(field);
    return (
        <FormField
            fieldTitle={<label>{field.displayName}</label>}
            fieldInput={<input type="text" {...register()}></input>}
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

export const textFieldPlugin: FormFieldPlugin<
    TextField<string>,
    z.ZodString | z.ZodOptional<z.ZodString>
> = {
    fieldType: "text",
    Component: TextField,
    Show: ({ value }) => value ?? null,
    toZodSchema: (field) =>
        transform(z.string().min(1))
            .apply(field.optional, makeOptionalString)
            .result(),
};
