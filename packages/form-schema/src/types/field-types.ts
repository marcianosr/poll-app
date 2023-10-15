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
export type HiddenField<Key> = BaseOpenFormField<Key, "hidden", "string">;

export type NumberFieldExtra = {
    integerValue?: boolean;
    min?: number;
    max?: number;
};

export type RangeSliderLabel = {
    title: string;
    value: number;
};

export type RangeSliderExtra = {
    min: number;
    max: number;
    step: number;
    labels: readonly RangeSliderLabel[];
};

export type NumberField<Key> = BaseOpenFormField<
    Key,
    "number",
    "number",
    NumberFieldExtra
>;

export type RangeSlider<Key> = BaseOpenFormField<
    Key,
    "range",
    "number",
    RangeSliderExtra
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

export type Plugin = Record<string, unknown>;

type PluginStore<TPlugin> = {
    get: (identifier: string) => TPlugin;
    getIdentifiers: () => string[];
};

type PluginFieldExtra<TPluginType extends Plugin> = {
    store: PluginStore<TPluginType>;
    displayProp: keyof TPluginType;
    formSchemaProp: keyof TPluginType;
};

export type PluginField<TKey, TPlugin extends Plugin> = BaseObjectFormField<
    TKey,
    "plugin",
    Readonly<
        [
            PickListField<"type", Readonly<FixedOption[]>>,
            ObjectField<"data", readonly FieldType<string>[]>
        ]
    >,
    PluginFieldExtra<TPlugin>
>;

export type FieldType<Key> =
    | CheckboxField<Key>
    | ColorField<Key>
    | HiddenField<Key>
    | NumberField<Key>
    | ObjectField<Key, readonly FieldType<string>[]>
    | ObjectListField<Key, readonly FieldType<string>[]>
    | PickListField<Key, Readonly<FixedOption[]>>
    | PluginField<Key, Plugin>
    | RadioField<Key, Readonly<FixedOption[]>>
    | RangeSlider<Key>
    | TextField<Key>
    | Title<Key>;

export type TypedForm = Readonly<FieldType<string>[]>;
