import React from "react";
import { RemixForm } from "./RemixForm";
import { convertToZod } from "./schemaConverter";
import { TypedForm } from "./types/field-types";
import { FormField } from "./base-form/FormField";
import { FieldProvider } from "./base-form/FieldContext";

type SchemaFormProps<Schema extends TypedForm> = {
  schema: Schema;
};

export const SchemaForm = <Schema extends TypedForm>({
  schema,
}: SchemaFormProps<Schema>) => {
  const zodSchema = convertToZod(schema);
  return (
    <RemixForm schema={zodSchema}>
      {({ Field, Errors, Button, watch, setValue, register }) => {
        return (
          <FieldProvider watch={watch} setValue={setValue} register={register}>
            {schema.map((field) => (
              <Field key={field.name} name={field.name}>
                {({ Errors }) => <FormField key={field.name} field={field} />}
              </Field>
            ))}
            <Errors />
            <Button />
          </FieldProvider>
        );
      }}
    </RemixForm>
  );
};
