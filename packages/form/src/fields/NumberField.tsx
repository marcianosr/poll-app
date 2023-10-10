import React from "react";
import { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { NumberField } from "../types/field-types";
import { z } from "zod";
import { useCustomField } from "../base-form/FieldContext";
import { transform } from "@marcianosrs/utils";

const NumberField = ({
  field,
  Errors,
}: FormFieldProps<NumberField<string>>) => {
  const { register } = useCustomField();
  return (
    <>
      <label>{field.displayName}</label>
      <input type="number" {...register(field.name)}></input>
      <Errors />
    </>
  );
};

export const numberFieldPlugin: FormFieldPlugin<
  NumberField<string>,
  z.ZodNumber | z.ZodOptional<z.ZodNumber>
> = {
  fieldType: "number",
  Component: NumberField,
  toZodSchema: (field) =>
    transform(z.number())
      .apply(field.max, (z, max) => z.max(max))
      .apply(field.min, (z, min) => z.min(min))
      .apply(field.optional, (z) => z.optional())
      .result(),
};
