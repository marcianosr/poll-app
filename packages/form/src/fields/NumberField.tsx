import React from "react";
import { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { NumberField } from "../types/field-types";
import { z } from "zod";
import { useCustomField } from "../base-form/FieldContext";

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
  z.ZodNumber
> = {
  fieldType: "number",
  Component: NumberField,
  toZodSchema: () => z.number(),
};
