import { ReactNode } from "react";
import { TypedForm } from "../types/field-types";
import { FormDataObject, ValueTypeOfField } from "../types/form";
import React from "react";
import { FormField } from "./FormField";

type FormComponentProps<FormSchema extends TypedForm> = {
  schema: FormSchema;
  value?: FormDataObject<FormSchema>;
  onChange?: (data: FormDataObject<FormSchema>) => void;
};

export const FormFields = <FormSchema extends TypedForm>({
  schema,
  value: data,
}: FormComponentProps<FormSchema>): ReactNode => {
  return (
    <>
      <p>Hello world</p> {JSON.stringify(schema)}
      {schema.map((field) => (
        <FormField
          field={field}
          value={
            data
              ? (data as Record<string, ValueTypeOfField<typeof field>>)[
                  field.name
                ]
              : undefined
          }
        />
      ))}
    </>
  );
};
