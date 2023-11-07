import {
	BaseFixedFormField,
	BaseObjectFormField,
	BaseObjectListFormField,
	BaseOpenFormField,
	FixedOption,
	FormField,
	FormSchema,
} from "@marcianosrs/form-schema";
import { z } from "zod";

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
