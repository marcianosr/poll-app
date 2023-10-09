import React from "react";
import { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { TextField } from "../types/field-types";
import { z } from "zod";
import { createFieldName } from "../base-form/createFieldName";

const TextField = ({ field, keyPrefix }: FormFieldProps<TextField<string>>) => {
  return (
    <>
      <label>{field.displayName}</label>
      <input type="text" name={createFieldName(keyPrefix, field.name)}></input>
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
