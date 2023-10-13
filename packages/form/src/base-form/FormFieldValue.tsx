import React from "react";
import { formFieldPlugins } from "../field-plugins";
import { DisplayValueProps, FormFieldPlugin } from "../types/field-plugin";
import { FieldType } from "@marcianosrs/form-schema";

export const FormFieldValue = <T extends FieldType<string>>({
    field,
    value,
}: DisplayValueProps<T>) => {
    const plugin = formFieldPlugins.get(field.fieldType) as unknown as
        | FormFieldPlugin<T>
        | undefined;

    if (!plugin) {
        return <p>Sorry field of {field.fieldType} is not supported</p>;
    }

    return <plugin.Show field={field} value={value} />;
};
