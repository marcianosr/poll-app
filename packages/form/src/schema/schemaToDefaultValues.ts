import { TypedForm } from "../types/field-types";

export const schemaToDefaultValues = <T extends TypedForm>(
  schema: T
): Record<string, unknown> => {
  const fields: Record<string, unknown> = {};

  for (const field of schema) {
    if ("defaultValue" in field) {
      fields[field.name] = field.defaultValue;
    }
    if (field.valueType === "objects") {
      fields[field.name] = [];
    }
  }

  return fields;
};
