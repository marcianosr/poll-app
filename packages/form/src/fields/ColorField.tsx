import React from "react";
import type { ColorField } from "@marcianosrs/form-schema";
import type { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { z } from "zod";
import { useCustomField } from "../base-form/FieldContext";
import { FormField } from "@marcianosrs/ui";

const ColorField = ({ field }: FormFieldProps<ColorField<string>>) => {
    const { register, errors } = useCustomField(field);
    return (
        <FormField
            fieldTitle={<label>{field.displayName}</label>}
            fieldInput={<input type="color" {...register()} />}
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

export const colorFieldPlugin: FormFieldPlugin<
    ColorField<string>,
    z.ZodString | z.ZodOptional<z.ZodString>
> = {
    fieldType: "color",
    Component: ColorField,
    Show: ({ value }) =>
        value ? (
            <span
                style={{
                    display: "inline-block",
                    width: "2em",
                    height: "1em",
                    backgroundColor: value,
                }}
            />
        ) : null,
    toZodSchema: () => z.string().min(1),
};
