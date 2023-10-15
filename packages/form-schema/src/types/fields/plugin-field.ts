import {
    BaseFixedFormField,
    BaseObjectFormField,
    FixedOption,
    FormField,
} from "../form";

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

type PluginForm = Readonly<
    [
        BaseFixedFormField<"type", "pluginType", Readonly<FixedOption[]>>,
        BaseObjectFormField<"data", "pluginData", Readonly<FormField[]>>
    ]
>;

export type PluginField<TKey, TPlugin extends Plugin> = BaseObjectFormField<
    TKey,
    "plugin",
    PluginForm,
    PluginFieldExtra<TPlugin>
>;
