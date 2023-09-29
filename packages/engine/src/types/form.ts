import { OmitNever } from "./utils";

export type FormSchema<
  Field extends
    | BaseOpenFormField<unknown, string, ValueTypes>
    | BaseFixedFormField<unknown, string, Readonly<string[]>, {}> =
    | BaseOpenFormField<unknown, string, ValueTypes>
    | BaseFixedFormField<unknown, string, Readonly<string[]>, {}>
> = Readonly<Field[]>;

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
  DefaultValue extends TypeMapping[ValueType] = TypeMapping[ValueType]
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

export type ValueTypeOfField<
  Field extends
    | BaseOpenFormField<unknown, string, ValueTypes>
    | BaseFixedFormField<unknown, string, Readonly<string[]>>
> = Field extends BaseFixedFormField<string, string, infer FieldType>
  ? FieldType[number]
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
