import React from "react";
import { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { TextField } from "../types/field-types";
import { z } from "zod";
import { useCustomField } from "../base-form/FieldContext";

const TextField = ({ field, Errors }: FormFieldProps<TextField<string>>) => {
  const { register } = useCustomField();
  return (
    <>
      <label>{field.displayName}</label>
      <input type="text" {...register(field.name)}></input>
      <Errors />
    </>
  );
};

export const textFieldPlugin: FormFieldPlugin<
  TextField<string>,
  z.ZodString
> = {
  fieldType: "text",
  Component: TextField,
  toZodSchema: () => z.string(),
};
