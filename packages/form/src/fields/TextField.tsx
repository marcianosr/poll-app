import React from "react";
import { FormFieldProps } from "../types/field-plugin";
import { TextField } from "../types/field-types";

const TextField = ({ field }: FormFieldProps<TextField<string>>) => {
  return (
    <>
      <label>{field.displayName}</label>
      <input type="text"></input>
    </>
  );
};

export default TextField;
