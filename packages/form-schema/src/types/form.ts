import { OmitNever } from "@marcianosrs/utils";

export type FormField =
	| BaseOpenFormField<unknown, string, ValueTypes>
	| BaseObjectListFormField<unknown, string, readonly FormField[]>
	| BaseObjectFormField<unknown, string, readonly FormField[]>
	| BaseFixedFormField<unknown, string, Readonly<FixedOption[]>>;

export type FormSchema<Field extends FormField = FormField> = Readonly<Field[]>;

export type TypeMapping = {
	none: never;
	string: string;
	number: number;
	boolean: boolean;
	unknown: unknown;
};

export type ValueTypes = keyof TypeMapping;

export type BaseOpenFormField<
	KeyName,
	FieldType,
	ValueType extends ValueTypes,
	Extra extends Record<string, unknown> = {},
	DefaultValue extends TypeMapping[ValueType] | undefined =
		| TypeMapping[ValueType]
		| undefined
> = {
	name: KeyName;
	displayName: string;
	fieldType: FieldType;
	valueType: ValueType;
	optional: boolean;
	defaultValue: DefaultValue;
} & Extra;

export type FixedOption<TType = string | number | boolean> = {
	display: string;
	value: TType;
};

export type BaseFixedFormField<
	KeyName,
	FieldType,
	AllowedValues extends readonly FixedOption[],
	Extra extends Record<string, unknown> = {}
> = {
	name: KeyName;
	displayName: string;
	fieldType: FieldType;
	valueType: "list";
	optional: boolean;
	options: AllowedValues;
	defaultValue: AllowedValues[number]["value"];
} & Extra;

export type BaseObjectListFormField<
	KeyName,
	FieldType,
	ObjectSchema extends FormSchema,
	Extra extends Record<string, unknown> = {}
> = {
	name: KeyName;
	displayName: string;
	fieldType: FieldType;
	valueType: "objects";
	optional: boolean;
	objectSchema: ObjectSchema;
} & Extra;

export type BaseObjectFormField<
	KeyName,
	FieldType,
	ObjectSchema extends FormSchema,
	Extra extends Record<string, unknown> = {}
> = {
	name: KeyName;
	displayName: string;
	fieldType: FieldType;
	valueType: "object";
	optional: boolean;
	objectSchema: ObjectSchema;
} & Extra;

type Prettify<O> = { [K in keyof O]: O[K] } & {};

type SelectOptional<
	TFields extends FormSchema,
	TValue extends boolean
> = OmitNever<{
	[Field in TFields[number] as Field["name"] &
		string]: Field["optional"] extends TValue
		? ValueTypeOfField<Field>
		: never;
}>;

export type FormDataObject<TFields extends FormSchema> = Prettify<
	SelectOptional<TFields, false> & Partial<SelectOptional<TFields, true>>
>;

export type ValueTypeOfField<Field extends FormField> =
	Field extends BaseFixedFormField<string, string, infer FieldType>
		? FieldType[number] extends FixedOption<infer ValueType>
			? ValueType
			: never
		: Field extends BaseObjectListFormField<unknown, string, infer Schema>
		? FormDataObject<Schema>[]
		: Field extends BaseObjectFormField<unknown, string, infer Schema>
		? SelectOptional<Schema, false> & Partial<SelectOptional<Schema, true>>
		: Field extends BaseOpenFormField<unknown, string, infer FieldKey>
		? TypeMapping[FieldKey & ValueTypes]
		: never;
