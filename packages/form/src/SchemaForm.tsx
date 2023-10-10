import React from "react";
import { RemixForm } from "./RemixForm";
import { ZodSchemaType, schemaToZod } from "./schema/schemaToZod";
import { TypedForm } from "./types/field-types";
import { FormField } from "./base-form/FormField";
import { FieldProvider } from "./base-form/FieldContext";
import { z } from "zod";
import { schemaToDefaultValues } from "./schema/schemaToDefaultValues";

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
  const zodSchema = schemaToZod(schema);
  const values: FormValues = schemaToDefaultValues(schema);

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
