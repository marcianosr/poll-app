import React from "react";
import { FieldType } from "../types/field-types";
import { formFieldPlugins } from "../field-plugins";
import { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";

export const FormField = <T extends FieldType<string>>({
  field,
  value,
  keyPrefix,
}: FormFieldProps<T>) => {
  const plugin = formFieldPlugins.get(field.fieldType) as unknown as
    | FormFieldPlugin<T>
    | undefined;

  if (!plugin) {
    return <p>Sorry field of {field.fieldType} is not supported</p>;
  }

  return <plugin.Component field={field} value={value} keyPrefix={keyPrefix} />;
};
