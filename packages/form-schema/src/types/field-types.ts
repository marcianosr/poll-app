import {
	BaseFixedFormField,
	BaseObjectListFormField,
	BaseOpenFormField,
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
	Options extends readonly string[]
> = BaseFixedFormField<Key, "select", Options>;

export type RadioField<
	Key,
	Options extends readonly string[]
> = BaseFixedFormField<Key, "radio", Options>;

export type ObjectListExtra = {
	minimalAmount: number;
	maximumAmount?: number;
};

export type ObjectListField<
	Key,
	ObjectSchema extends TypedForm
> = BaseObjectListFormField<Key, "objectList", ObjectSchema, ObjectListExtra>;

export type FieldType<Key> =
	| Title<Key>
	| ColorField<Key>
	| TextField<Key>
	| NumberField<Key>
	| CheckboxField<Key>
	| PickListField<Key, Readonly<string[]>>
	| RadioField<Key, Readonly<string[]>>
	| RangeSlider<Key>
	| ObjectListField<Key, readonly FieldType<string>[]>;

export type TypedForm = Readonly<FieldType<string>[]>;
