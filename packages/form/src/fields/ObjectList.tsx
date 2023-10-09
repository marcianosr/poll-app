import React from "react";
import { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { ObjectListField, TypedForm } from "../types/field-types";
import { z } from "zod";
import { convertToZod } from "../schemaConverter";
import { FormFields } from "../base-form/FormFields";

const ObjectList = ({
  field,
  value,
  keyPrefix = [],
}: FormFieldProps<ObjectListField<string, TypedForm>>) => {
  return (
    <>
      <label>{field.displayName}</label>
      <div style={{ border: "1px solid red", padding: "0.5rem" }}>
        <FormFields
          schema={field.objectSchema}
          keyPrefix={[...keyPrefix, field.name, "0"]}
        />
        <button>Add</button>
      </div>
    </>
  );
};

export const objectListPlugin: FormFieldPlugin<
  ObjectListField<string, TypedForm>,
  z.ZodArray<z.ZodTypeAny>
> = {
  fieldType: "objectList",
  Component: ObjectList,
  toZodSchema: (field) => convertToZod(field.objectSchema).array(),
};
