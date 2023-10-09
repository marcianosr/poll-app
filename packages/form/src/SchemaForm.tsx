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
    <RemixForm
      schema={zodSchema}
      renderField={(props) => {
        const field = schema.find((f) => f.name === props.name);

        if (!field) {
          return <p>404: Field not found</p>;
        }
        return <FormField key={props.name} value={props.value} field={field} />;
      }}
    />
  );
};
