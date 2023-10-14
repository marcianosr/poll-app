import { Plugin, PluginField } from "./fields/plugin-field";
import {
    BaseFixedFormField,
    BaseObjectFormField,
    BaseObjectListFormField,
    BaseOpenFormField,
    FixedOption,
} from "./form";

export type Title<Key> = BaseOpenFormField<Key, "title", "none", {}, undefined>;

export type TextFieldExtra = {
    prefix?: string;
    postfix?: string;
};
export type TextField<Key> = BaseOpenFormField<
    Key,
    "text",
    "string",
    TextFieldExtra
>;
export type ColorField<Key> = BaseOpenFormField<Key, "color", "string">;

export type NumberFieldExtra = {
    integerValue?: boolean;
    min?: number;
    max?: number;
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
    Options extends readonly FixedOption[]
> = BaseFixedFormField<Key, "select", Options>;

export type RadioField<
    Key,
    Options extends readonly FixedOption[]
> = BaseFixedFormField<Key, "radio", Options>;

export type ObjectListExtra = {
    minimalAmount: number;
    maximumAmount?: number;
};

export type ObjectListField<
    Key,
    TObjectSchema extends TypedForm
> = BaseObjectListFormField<Key, "objectList", TObjectSchema, ObjectListExtra>;

export type ObjectField<
    Key,
    TObjectSchema extends TypedForm
> = BaseObjectFormField<Key, "object", TObjectSchema>;

export type FieldType<Key> =
    | Title<Key>
    | ColorField<Key>
    | TextField<Key>
    | NumberField<Key>
    | CheckboxField<Key>
    | PickListField<Key, Readonly<FixedOption[]>>
    | RadioField<Key, Readonly<FixedOption[]>>
    | ObjectField<Key, readonly FieldType<string>[]>
    | ObjectListField<Key, readonly FieldType<string>[]>
    | PluginField<Key, Plugin>;

export type TypedForm = Readonly<FieldType<string>[]>;
