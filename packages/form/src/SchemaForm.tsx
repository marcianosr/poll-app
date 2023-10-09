import React from "react";
import { RemixForm } from "./RemixForm";
import { convertToZod } from "./schemaConverter";
import { TypedForm } from "./types/field-types";
import { FormField } from "./base-form/FormField";

type SchemaFormProps<Schema extends TypedForm> = {
  schema: Schema;
};

export const SchemaForm = <Schema extends TypedForm>({
  schema,
}: SchemaFormProps<Schema>) => {
  const zodSchema = convertToZod(schema);
  return (
    <RemixForm schema={zodSchema}>
      {({ Field, Errors, Button, watch, setValue }) => {
        return (
          <>
            {schema.map((field) => (
              <FormField key={field.name} field={field} />
            ))}
            <Errors />
            <Button />
          </>
        );
      }}
    </RemixForm>
  );
};
