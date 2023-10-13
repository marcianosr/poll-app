import { z } from "zod";
import { formFieldPlugins } from "../field-plugins";
import { FieldType, FormSchema, TypedForm } from "@marcianosrs/form-schema";
import { FormFieldPlugin } from "../types/field-plugin";

export type ZodSchemaType<Fields extends FormSchema> = z.ZodObject<{
    [Key in Fields[number] as Key["name"] & string]: z.ZodTypeAny;
}>;

export const schemaToZod = <T extends TypedForm>(
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
