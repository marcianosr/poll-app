import React from "react";
import { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { Title } from "../types/field-types";
import { z } from "zod";

const TitleField = ({ field }: FormFieldProps<Title<string>>) => {
  return <h1>{field.displayName}</h1>;
};

export const titlePlugin: FormFieldPlugin<Title<string>, z.ZodNever> = {
  fieldType: "title",
  Component: TitleField,
  toZodSchema: () => z.never(),
};
