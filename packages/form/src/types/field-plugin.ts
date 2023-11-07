import type { ComponentType } from "react";
import type {
	FieldType,
	TypedForm,
	ValueTypeOfField,
} from "@marcianosrs/form-schema";
import { ZodSchema, z } from "zod";

export type FormFieldProps<T extends FieldType<string>> = {
	field: T;
};

export type DisplayValueProps<T extends FieldType<string>> = {
	field: T;
	value?: ValueTypeOfField<T>;
};

export type FormFieldPlugin<
	T extends FieldType<string>,
	Z extends z.ZodTypeAny = z.ZodTypeAny
> = {
	fieldType: T["fieldType"];
	Component: ComponentType<FormFieldProps<T>>;
	Show: ComponentType<DisplayValueProps<T>>;
	toZodSchema: (
		field: T,
		resolver: <T extends TypedForm>(schema: T) => ZodSchema<T>
	) => Z;
};
