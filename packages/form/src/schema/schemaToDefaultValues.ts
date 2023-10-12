import { FormDataObject, TypedForm } from "@marcianosrs/form-schema";

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
    }

    return fields as FormDataObject<T>;
};
