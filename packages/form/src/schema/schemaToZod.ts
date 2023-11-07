import { z } from "zod";
import type { FieldType, TypedForm } from "@marcianosrs/form-schema";
import { FormFieldPlugin } from "../types/field-plugin";
import { formFieldPlugins } from "../field-plugins";
import { ZodSchemaType } from "./zodSchemaType";

export type TypeMapping = {
	none: never;
	string: z.ZodString;
	number: z.ZodNumber;
	boolean: z.ZodBoolean;
	unknown: z.ZodUnknown;
};

export type ValueTypes = keyof TypeMapping;

export const schemaToZod = <T extends TypedForm>(
	schema: T
): ZodSchemaType<T> => {
	const fields: Record<string, z.ZodTypeAny> = {};

	for (const field of schema) {
		const plugin = formFieldPlugins.get(field.fieldType) as unknown as
			| FormFieldPlugin<FieldType<string>>
			| undefined;

		const fieldType =
			plugin?.toZodSchema(field, schemaToZod as any) ?? z.never();

		if (fieldType instanceof z.ZodNever) continue;
		if (
			fieldType instanceof z.ZodOptional &&
			fieldType.unwrap() instanceof z.ZodNever
		)
			continue;

		fields[field.name] = fieldType;
	}

	return z.object(fields) as unknown as ZodSchemaType<T>;
};
