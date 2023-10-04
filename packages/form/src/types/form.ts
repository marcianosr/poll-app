import { OmitNever } from "./utils";

export type FormField =
  | BaseOpenFormField<unknown, string, ValueTypes>
  | BaseObjectListFormField<unknown, string, readonly FormField[]>
  | BaseFixedFormField<unknown, string, Readonly<string[]>>;

export type FormSchema<Field extends FormField = FormField> = Readonly<Field[]>;

export type TypeMapping = {
  none: never;
  string: string;
  number: number;
  boolean: boolean;
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

export type BaseFixedFormField<
  KeyName,
  FieldType,
  AllowedValues extends readonly string[],
  Extra extends Record<string, unknown> = {}
> = {
  name: KeyName;
  displayName: string;
  fieldType: FieldType;
  valueType: "list";
  optional: boolean;
  options: AllowedValues;
  defaultValue: AllowedValues[number];
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

export type ValueTypeOfField<Field extends FormField> =
  Field extends BaseFixedFormField<string, string, infer FieldType>
    ? FieldType[number]
    : Field extends BaseObjectListFormField<unknown, string, infer Schema>
    ? FormDataObject<Schema>[]
    : Field extends BaseOpenFormField<unknown, string, infer FieldKey>
    ? TypeMapping[FieldKey & ValueTypes]
    : never;

type SelectOptional<
  Fields extends FormSchema,
  Value extends boolean
> = OmitNever<{
  [Field in Fields[number] as Field["name"] &
    string]: Field["optional"] extends Value ? ValueTypeOfField<Field> : never;
}>;

type Prettify<O> = { [K in keyof O]: O[K] } & {};

export type FormDataObject<Fields extends FormSchema> = Prettify<
  SelectOptional<Fields, false> & Partial<SelectOptional<Fields, true>>
>;
