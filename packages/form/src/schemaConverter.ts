import { TypedForm } from "./types/field-types";
import { z } from "zod";
import { FormSchema } from "./types/form";
import { formFieldPlugins } from "./field-plugins";
import { FormFieldPlugin } from "./types/field-plugin";
import { FieldType } from "../dist";

type ZodSchemaType<Fields extends FormSchema> = z.ZodObject<{
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

    fields[field.name] = plugin?.toZodSchema(field) ?? z.never();
  }

  return z.object(fields) as ZodSchemaType<T>;
};
