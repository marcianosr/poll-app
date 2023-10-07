import React from "react";
import { FieldType } from "../types/field-types";
import { formFieldPlugins } from "../field-plugins";
import { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";

export const FormField = <T extends FieldType<string>>({
  field,
  value,
  onChange,
}: FormFieldProps<T>) => {
  const plugin = formFieldPlugins.get(field.fieldType) as unknown as
    | FormFieldPlugin<T>
    | undefined;

  if (!plugin) {
    return <div>Sorry field of {field.fieldType} is not supported</div>;
  }

  const Field = React.lazy(plugin.Component);
  return <Field field={field} value={value} onChange={onChange} />;
};
