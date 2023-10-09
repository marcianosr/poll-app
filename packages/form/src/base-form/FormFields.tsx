import { ReactNode } from "react";
import { TypedForm } from "../types/field-types";
import { FormDataObject, ValueTypeOfField } from "../types/form";
import React from "react";
import { FormField } from "./FormField";

type FormComponentProps<FormSchema extends TypedForm> = {
  schema: FormSchema;
  value?: FormDataObject<FormSchema>;
  keyPrefix?: string[];
};

export const FormFields = <FormSchema extends TypedForm>({
  schema,
  keyPrefix,
}: FormComponentProps<FormSchema>): ReactNode => {
  return (
    <>
      {schema.map((field) => (
        <FormField key={field.name} field={field} keyPrefix={keyPrefix} />
      ))}
    </>
  );
};
