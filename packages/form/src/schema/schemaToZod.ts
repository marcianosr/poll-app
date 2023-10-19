import { z } from "zod";
import { formFieldPlugins } from "../field-plugins";
import {
    BaseFixedFormField,
    BaseObjectFormField,
    BaseObjectListFormField,
    BaseOpenFormField,
    FieldType,
    FixedOption,
    FormField,
    FormSchema,
    TypedForm,
} from "@marcianosrs/form-schema";
import { FormFieldPlugin } from "../types/field-plugin";

export type TypeMapping = {
    none: never;
    string: z.ZodString;
    number: z.ZodNumber;
    boolean: z.ZodBoolean;
    unknown: z.ZodUnknown;
};

export type ValueTypes = keyof TypeMapping;

export type ZodFieldType<TField extends FormField> =
    TField extends BaseObjectListFormField<unknown, string, infer Schema>
        ? z.ZodArray<ZodSchemaType<Schema>>
        : TField extends BaseObjectFormField<unknown, string, infer Schema>
        ? ZodSchemaType<Schema>
        : TField extends BaseFixedFormField<string, string, infer FieldType>
        ? FieldType[number] extends FixedOption<infer ValueType>
            ? z.ZodType<ValueType>
            : never
        : TField extends BaseOpenFormField<string, string, infer TValueType>
        ? TypeMapping[TValueType & ValueTypes]
        : z.ZodTypeAny;

export type ZodSchemaType<Fields extends FormSchema> = z.ZodObject<{
    [Field in Fields[number] as Field["name"] & string]: ZodFieldType<Field>;
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
