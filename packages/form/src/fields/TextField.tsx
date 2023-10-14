import React from "react";
import type { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { z } from "zod";
import { useCustomField } from "../base-form/FieldContext";
import type { TextField } from "@marcianosrs/form-schema";
import { transform } from "@marcianosrs/utils";
import { makeOptionalString } from "../schema/zodUtils";

const TextField = ({ field }: FormFieldProps<TextField<string>>) => {
    const { register, errors } = useCustomField(field);
    return (
        <div>
            <label>{field.displayName}</label>
            <input type="text" {...register()}></input>
            {errors?.map((e, i) => (
                <p key={i}>{e}</p>
            ))}
        </div>
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
