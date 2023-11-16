import React from "react";
import type { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { z } from "zod";
import { ObjectScopeProvider, useCustomField } from "../base-form/FieldContext";
import {
	type PluginField,
	type Plugin,
	type FixedOption,
	type PickListField,
	type TypedForm,
	schemaToDefaultValues,
	type FieldType,
} from "@marcianosrs/form-schema";
import { selectFieldPlugin } from "./SelectField";
import { FormFields } from "../base-form/FormFields";

type PluginFieldValue = { type: string; data: Record<string, unknown> };

const PluginField = ({
	field,
}: FormFieldProps<PluginField<string, Plugin>>) => {
	const { errors, watch } = useCustomField(field);

	const SelectField = selectFieldPlugin.Component;

	const pluginIds = field.store.getIdentifiers();

	const selectFieldDefinition = {
		name: "type",
		fieldType: "select",
		valueType: "list",
		displayName: field.displayName,
		optional: true,
		defaultValue: pluginIds[0],
		options: pluginIds.map((id) => {
			const plugin = field.store.get(id);
			return { value: id, display: `${plugin[field.displayProp]}` };
		}),
	} as const satisfies PickListField<"type", readonly FixedOption<string>[]>;

	const value = watch() as PluginFieldValue;

	const selectedPluginId = value.type ?? pluginIds[0];

	const fieldPlugin = field.store.get(selectedPluginId);
	const objectSchema = fieldPlugin?.[field.formSchemaProp] as TypedForm;
	const hasSettings = objectSchema?.length > 0;

	const data = hasSettings
		? value.data ?? schemaToDefaultValues(objectSchema)
		: {};

	return (
		<div>
			<ObjectScopeProvider<{ type: string; data: any }>
				path={[`${field.name}`]}
				defaultValues={{ type: selectedPluginId, data }}
			>
				{() => (
					<>
						<SelectField field={selectFieldDefinition} />
						<fieldset>
							<legend>{field.displayName} Settings</legend>
							{hasSettings && (
								<ObjectScopeProvider<{}>
									path={["data"]}
									defaultValues={data}
								>
									{() => <FormFields schema={objectSchema} />}
								</ObjectScopeProvider>
							)}
							{!hasSettings && <p>No settings found</p>}
						</fieldset>
					</>
				)}
			</ObjectScopeProvider>
			{errors?.map((e, i) => (
				<p key={i}>{e}</p>
			))}
		</div>
	);
};

const isPlugin = (value: unknown): value is PluginFieldValue =>
	value !== undefined;

export const pluginFieldPlugin: FormFieldPlugin<
	PluginField<string, Plugin>,
	z.ZodDiscriminatedUnion<
		"type",
		z.ZodObject<{
			type: z.ZodLiteral<string>;
			data: z.ZodObject<{}>;
		}>[]
	>
> = {
	fieldType: "plugin",
	Component: PluginField,
	Show: ({ field, value }) => {
		if (!isPlugin(value)) return "";

		const plugin = field.store.get(value.type);
		return plugin ? `${plugin[field.displayProp]}` : "unknown plugin";
	},
	toZodSchema: (field, resolver) => {
		const pluginIds = field.store.getIdentifiers();

		type ZodPluginObject = z.ZodObject<{
			type: z.ZodLiteral<string>;
			data: z.ZodObject<{ [x: string]: z.ZodTypeAny }>;
		}>;

		return z.discriminatedUnion(
			"type",
			pluginIds.map((id) => {
				const plugin = field.store.get(id);
				return z.object({
					type: z.literal(id),
					data: resolver(
						(plugin[`${field.formSchemaProp}`] ?? []) as Readonly<
							FieldType<string>[]
						>
					),
				});
			}) as unknown as [ZodPluginObject, ZodPluginObject]
		);
	},
};
