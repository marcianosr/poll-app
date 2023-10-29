import { KeysOfType } from "@marcianosrs/utils";
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

export type PluginForm = Readonly<
	[
		PickListField<"type", Readonly<FixedOption<string>[]>>,
		ObjectField<"data", readonly FieldType<string>[]>
	]
>;

export type PluginField<TKey, TPlugin extends Plugin> = BaseObjectFormField<
	TKey,
	"plugin",
	PluginForm,
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

export const pluginField = <TKey extends string, TPluginType extends Plugin>(
	name: TKey,
	displayName: string,
	store: PluginStore<TPluginType>,
	displayProp: KeysOfType<TPluginType, string>,
	formSchemaProp: KeysOfType<TPluginType, TypedForm>
): Readonly<{
	name: TKey;
	displayName: string;
	fieldType: "plugin";
	valueType: "object";
	store: PluginStore<TPluginType>;
	displayProp: KeysOfType<TPluginType, string>;
	formSchemaProp: KeysOfType<TPluginType, TypedForm>;
	optional: false;
	objectSchema: Readonly<
		[
			{
				name: "type";
				displayName: string;
				fieldType: "select";
				valueType: "list";
				optional: false;
				options: Readonly<FixedOption<string>[]>;
				defaultValue: "";
			},
			{
				name: "data";
				displayName: "Settings";
				fieldType: "object";
				valueType: "object";
				optional: false;
				objectSchema: Readonly<[]>;
			}
		]
	>;
}> => {
	const pluginForm = [
		{
			name: "type",
			displayName,
			fieldType: "select",
			valueType: "list",
			optional: false,
			options: [],
			defaultValue: "",
		},
		{
			name: "data",
			displayName: "Settings",
			fieldType: "object",
			valueType: "object",
			optional: false,
			objectSchema: [],
		},
	] as const satisfies PluginForm;

	const fieldDef = {
		name,
		displayName,
		fieldType: "plugin",
		valueType: "object",
		store,
		displayProp,
		formSchemaProp,
		optional: false,
		objectSchema: pluginForm,
	} as const satisfies PluginField<TKey, TPluginType>;

	return fieldDef;
};
