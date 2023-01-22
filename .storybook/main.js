module.exports = {
	stories: [
		"../app/components/**/*.stories.@(js|jsx|ts|tsx)",
		"../app/compositions/**/*.stories.@(js|jsx|ts|tsx)",
		"../app/ui/**/*.stories.@(js|jsx|ts|tsx)",
	],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
	],
	framework: "@storybook/react",
};
