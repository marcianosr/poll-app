import { Preview } from "@storybook/react";
import React from "react";
import { ThemeProvider } from "../src/theming/ThemeContext";
import { themeStore } from "@marcianosrs/engine";
import "../src/registerThemes";

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: "^on[A-Z].*" },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
	},
	decorators: [
		(Story, context) => {
			const theme = context.globals.theme;
			return (
				<ThemeProvider theme={theme} themeSettings={{}}>
					<Story />
				</ThemeProvider>
			);
		},
	],
	globalTypes: {
		theme: {
			description: "Global theme",
			defaultValue: "html",
			toolbar: {
				title: "Theme",
				icon: "circlehollow",
				items: themeStore.getIdentifiers(),
				dynamicTitle: true,
			},
		},
	},
};

export default preview;
