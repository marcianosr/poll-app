import React from "react";
import { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { z } from "zod";
import { useCustomField } from "../base-form/FieldContext";
import { TextField } from "@marcianosrs/form-schema";

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
    z.ZodString
> = {
    fieldType: "text",
    Component: TextField,
    Show: ({ value }) => value ?? null,
    toZodSchema: () => z.string().min(1),
};
