import { BaseFixedFormField, BaseOpenFormField } from "../types/form";

export type Title<Key> = BaseOpenFormField<Key, "title", "none">;

export type TextFieldExtra = {
  prefix?: string;
  postfix?: string;
  defaultValue?: string;
};
export type TextField<Key> = BaseOpenFormField<
  Key,
  "text",
  "string",
  TextFieldExtra
>;

export type NumberFieldExtra = {
  min?: number;
  max?: number;
  defaultValue?: number;
};
export type NumberField<Key> = BaseOpenFormField<
  Key,
  "number",
  "number",
  NumberFieldExtra
>;

export type CheckboxField<Key> = BaseOpenFormField<Key, "checkbox", "boolean">;

export type PickListField<
  Key,
  Options extends readonly string[]
> = BaseFixedFormField<Key, "select", Options>;

export type FieldType<Key> =
  | Title<Key>
  | TextField<Key>
  | NumberField<Key>
  | CheckboxField<Key>
  | PickListField<Key, Readonly<string[]>>;

export type TypedForm = Readonly<FieldType<string>[]>;
