export const createPluginStore = <BasePlugin, AddType = BasePlugin>(
    getIdentifier: (plugin: BasePlugin) => string
) => {
    const plugins: BasePlugin[] = [];

    return {
        add: <Plugin extends AddType>(type: Plugin) => {
            plugins.push(type as unknown as BasePlugin);
        },
        get: (pluginId: string): BasePlugin | undefined =>
            plugins.find((e) => getIdentifier(e) === pluginId),
        getIdentifiers: () => plugins.map(getIdentifier),
    };
};
