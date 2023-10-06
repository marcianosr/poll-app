import { ReactNode } from "react";
import { TypedForm } from "../types/field-types";
import { FormDataObject } from "../types/form";
import React from "react";

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
    <div>
      <p>Hello world</p>
      {JSON.stringify(schema)}
    </div>
  );
};
