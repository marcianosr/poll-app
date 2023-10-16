import React from "react";
import type { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { z } from "zod";
import { ObjectScopeProvider, useCustomField } from "../base-form/FieldContext";
import {
    type PluginField,
    type Plugin,
    type PluginStore,
    type FixedOption,
    type PickListField,
    type TypedForm,
    schemaToDefaultValues,
    type FieldType,
    type PluginForm,
} from "@marcianosrs/form-schema";
import { selectFieldPlugin } from "./SelectField";
import { FormFields } from "../base-form/FormFields";
import { schemaToZod } from "../schema/schemaToZod";

const PluginField = ({
    field,
}: FormFieldProps<PluginField<string, Plugin>>) => {
    const { errors, watch, setValue } = useCustomField(field);

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

    const selectedPluginId = value.type ?? pluginIds[0];

    const fieldPlugin = field.store.get(selectedPluginId);
    const objectSchema = fieldPlugin?.[field.formSchemaProp] as TypedForm;
    const hasSettings = objectSchema?.length > 0;

    const data = hasSettings
        ? value.data ?? schemaToDefaultValues(objectSchema)
        : {};

    return (
        <div>
            <ObjectScopeProvider<{}>
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

export const pluginFieldPlugin: FormFieldPlugin<
    PluginField<string, Plugin>,
    z.ZodTypeAny
> = {
    fieldType: "plugin",
    Component: PluginField,
    Show: ({ field }) => `${field.displayName}`,
    toZodSchema: (field) => {
        const pluginIds = field.store.getIdentifiers();

        return z.union(
            pluginIds.map((id) => {
                const plugin = field.store.get(id);
                return z.object({
                    type: z.literal(id),
                    data: schemaToZod(
                        plugin[
                            `${field.formSchemaProp}`
                        ] as unknown as Readonly<FieldType<string>[]>
                    ),
                });
            }) as unknown as Readonly<[z.ZodTypeAny, z.ZodTypeAny]>
        );
    },
};

export const pluginField = <TKey extends string, TPluginType extends Plugin>(
    name: TKey,
    displayName: string,
    store: PluginStore<TPluginType>,
    displayProp: keyof TPluginType,
    formSchemaProp: keyof TPluginType
): Readonly<{
    name: TKey;
    displayName: string;
    fieldType: "plugin";
    valueType: "object";
    store: PluginStore<TPluginType>;
    displayProp: keyof TPluginType;
    formSchemaProp: keyof TPluginType;
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
