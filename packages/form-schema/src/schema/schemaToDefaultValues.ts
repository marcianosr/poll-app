import { TypedForm } from "../types/field-types";
import { FormDataObject } from "../types/form";

export const schemaToDefaultValues = <T extends TypedForm>(
    schema: T
): FormDataObject<T> => {
    const fields: Record<string, unknown> = {};

    for (const field of schema) {
        if ("defaultValue" in field) {
            fields[field.name] = field.defaultValue;
        }
        if (field.valueType === "objects") {
            fields[field.name] = [];
        }
        if (field.valueType === "object") {
            fields[field.name] = schemaToDefaultValues(field.objectSchema);
        }
    }

    return fields as FormDataObject<T>;
};
