import { ThemePlugin, themeStore } from "@marcianosrs/engine";
import { htmlTheme } from "../themes/html/theme";
import { useTheme } from "./ThemeContext";
import type { Theme } from "./ThemeType";
import { TypedForm } from "@marcianosrs/form-schema";

export const useThemedElement = <TElement extends keyof Theme>(
	elementType: TElement
): Theme[TElement] => {
	const { themeName } = useTheme();
	const plugin = (themeStore.get(themeName) ?? htmlTheme) as ThemePlugin<
		TypedForm,
		Theme
	>;
	return plugin.components[elementType];
};
