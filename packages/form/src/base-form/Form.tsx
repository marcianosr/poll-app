import { ReactNode, Suspense } from "react";
import { TypedForm } from "../types/field-types";
import { FormDataObject, ValueTypeOfField } from "../types/form";
import React from "react";
import { FormField } from "./FormField";

type FormComponentProps<FormSchema extends TypedForm> = {
  schema: FormSchema;
  data?: FormDataObject<FormSchema>;
  onDataUpdate: (data: FormDataObject<FormSchema>) => void;
};

export const Form = <FormSchema extends TypedForm>({
  schema,
  data,
  onDataUpdate,
}: FormComponentProps<FormSchema>): ReactNode => {
  return (
    <>
      <p>Hello world</p> {JSON.stringify(schema)}
      <Suspense>
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
      </Suspense>
    </>
  );
};
