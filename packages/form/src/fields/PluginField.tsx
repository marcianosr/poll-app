import React from "react";
import type { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { z } from "zod";
import { ObjectScopeProvider, useCustomField } from "../base-form/FieldContext";
import {
    type PluginField,
    type Plugin,
    type PluginStore,
    type PluginForm,
    type FixedOption,
    type PickListField,
    type TypedForm,
    schemaToDefaultValues,
} from "@marcianosrs/form-schema";
import { selectFieldPlugin } from "./SelectField";
import { FormFields } from "../base-form/FormFields";

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
    } as const satisfies PickListField<"type", readonly FixedOption[]>;

    const value = watch() as { type: string; data: unknown };

    const fieldPlugin = field.store.get(value.type);
    const objectSchema = fieldPlugin?.[field.formSchemaProp] as TypedForm;
    const hasSettings = objectSchema?.length > 0;

    const data = hasSettings ? schemaToDefaultValues(objectSchema) : {};

    return (
        <div>
            <ObjectScopeProvider<{}>
                path={[`${field.name}`]}
                defaultValues={{ type: pluginIds[0] }}
            >
                {() => (
                    <>
                        <SelectField field={selectFieldDefinition as any} />
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

export const pluginFieldPlugin: FormFieldPlugin<
    PluginField<string, Plugin>,
    z.ZodTypeAny
> = {
    fieldType: "plugin",
    Component: PluginField,
    Show: ({ field }) => `${field.displayName}`,
    toZodSchema: (field) =>
        z.object({
            type: z.string(),
            data: z.unknown(),
        }),
};

export const pluginField = <TKey extends string, TPluginType extends Plugin>(
    name: TKey,
    displayName: string,
    store: PluginStore<TPluginType>,
    displayProp: keyof TPluginType,
    formSchemaProp: keyof TPluginType
) => {
    const pluginForm = [
        {
            name: "type",
            displayName,
            fieldType: "pluginType",
            valueType: "list",
            optional: false,
            options: [],
            defaultValue: "",
        },
        {
            name: "data",
            displayName: "Settings",
            fieldType: "pluginData",
            valueType: "unknown",
            optional: false,
            defaultValue: {},
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
