import React from "react";
import { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { NumberField } from "../types/field-types";
import { z } from "zod";
import { createFieldName } from "../base-form/createFieldName";

const NumberField = ({
  field,
  keyPrefix,
}: FormFieldProps<NumberField<string>>) => {
  return (
    <>
      <label>{field.displayName}</label>
      <input
        type="number"
        name={createFieldName(keyPrefix, field.name)}
      ></input>
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
