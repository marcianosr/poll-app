import React from "react";
import { formFieldPlugins } from "../field-plugins";
import { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { FieldType } from "@marcianosrs/form-schema";

export const FormField = <T extends FieldType<string>>({
    field,
}: FormFieldProps<T>) => {
    const plugin = formFieldPlugins.get(field.fieldType) as unknown as
        | FormFieldPlugin<T>
        | undefined;

    if (!plugin) {
        return <p>Sorry field of {field.fieldType} is not supported</p>;
    }

    return <plugin.Component field={field} />;
};
