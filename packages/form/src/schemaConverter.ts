import { TypedForm } from "./types/field-types";
import { z } from "zod";
import { FormSchema } from "./types/form";
import { formFieldPlugins } from "./field-plugins";
import { FormFieldPlugin } from "./types/field-plugin";
import { FieldType } from "../dist";

export type ZodSchemaType<Fields extends FormSchema> = z.ZodObject<{
  [Key in Fields[number] as Key["name"] & string]: z.ZodTypeAny;
}>;

export const convertToZod = <T extends TypedForm>(
  schema: T
): ZodSchemaType<T> => {
  const fields: Record<string, z.ZodTypeAny> = {};

  for (const field of schema) {
    const plugin = formFieldPlugins.get(field.fieldType) as unknown as
      | FormFieldPlugin<FieldType<string>>
      | undefined;

    const fieldType = plugin?.toZodSchema(field) ?? z.never();

    if (fieldType instanceof z.ZodNever) continue;
    if (
      fieldType instanceof z.ZodOptional &&
      fieldType.unwrap() instanceof z.ZodNever
    )
      continue;

    fields[field.name] = fieldType;
  }

  return z.object(fields) as ZodSchemaType<T>;
};
