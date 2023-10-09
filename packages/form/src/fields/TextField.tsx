import React from "react";
import { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { TextField } from "../types/field-types";
import { z } from "zod";

const TextField = ({
  field,
  value,
}: //   onChange,
FormFieldProps<TextField<string>>) => {
  return (
    <>
      <label>{field.displayName}</label>
      <input
        type="text"
        name={field.name}
        value={value}
        // onChange={onChange ? (e) => onChange(e.currentTarget.value) : undefined}
      ></input>
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
