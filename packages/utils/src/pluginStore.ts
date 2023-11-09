export const createPluginStore = <BasePlugin, AddType = BasePlugin>(
	getIdentifier: (plugin: BasePlugin) => string
) => {
	const plugins: BasePlugin[] = [];

	return {
		add: <Plugin extends AddType>(type: Plugin) => {
			const identifier = getIdentifier(type);
			if (
				plugins.some((plugin) => getIdentifier(plugin) === identifier)
			) {
				return;
			}
			plugins.push(type as unknown as BasePlugin);
		},
		get: (pluginId: string): BasePlugin | undefined =>
			plugins.find((e) => getIdentifier(e) === pluginId),
		getIdentifiers: () => plugins.map(getIdentifier),
	};
};
