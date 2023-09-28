export const createPluginStore = <BasePlugin>(
  getIdentifier: (plugin: BasePlugin) => string
) => {
  const plugins: BasePlugin[] = [];

  return {
    add: <Plugin extends BasePlugin>(type: Plugin) => {
      plugins.push(type);
    },
    get: (pluginId: string): BasePlugin | undefined =>
      plugins.find((e) => getIdentifier(e) === pluginId),
  };
};
