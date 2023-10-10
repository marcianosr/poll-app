import React from "react";
import { RemixForm } from "./RemixForm";
import { ZodSchemaType, convertToZod } from "./schemaConverter";
import { TypedForm } from "./types/field-types";
import { FormField } from "./base-form/FormField";
import { FieldProvider } from "./base-form/FieldContext";
import { z } from "zod";

type SchemaFormProps<Schema extends TypedForm> = {
  schema: Schema;
};

interface FormValues {
  [x: string]: unknown | unknown[];
}

type RemixFormValues<Schema extends TypedForm> = Partial<
  Record<keyof z.infer<ZodSchemaType<Schema>>, unknown>
>;

export const SchemaForm = <Schema extends TypedForm>({
  schema,
}: SchemaFormProps<Schema>) => {
  const zodSchema = convertToZod(schema);

  // build defaultValues
  const values: FormValues = {
    teams: [],
  };

  return (
    <RemixForm schema={zodSchema} values={values as RemixFormValues<Schema>}>
      {({ Field, Errors, Button, watch, setValue, register }) => {
        return (
          <FieldProvider watch={watch} setValue={setValue} register={register}>
            {schema.map((field) => (
              <Field key={field.name} name={field.name}>
                {({ Errors }) => (
                  <FormField key={field.name} field={field} Errors={Errors} />
                )}
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
