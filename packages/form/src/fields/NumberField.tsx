import React from "react";
import { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { NumberField } from "../types/field-types";
import { z } from "zod";

const NumberField = ({ field, value }: FormFieldProps<NumberField<string>>) => {
  return (
    <>
      <label>{field.displayName}</label>
      <input type="number" name={field.name} value={value}></input>
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
