import { ReactNode } from "react";
import React from "react";
import { FormField } from "./FormField";
import { FormDataObject, TypedForm } from "@marcianosrs/form-schema";

type FormComponentProps<FormSchema extends TypedForm> = {
    schema: FormSchema;
    value?: FormDataObject<FormSchema>;
    keyPrefix?: string[];
};

export const FormFields = <FormSchema extends TypedForm>({
    schema,
}: FormComponentProps<FormSchema>): ReactNode => (
    <>
        {schema.map((field) => (
            <FormField key={field.name} field={field} />
        ))}
    </>
);
