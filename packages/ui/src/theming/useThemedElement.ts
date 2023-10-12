import { htmlTheme } from "../themes/html/theme";
import { useTheme } from "./ThemeContext";
import type { Theme } from "./ThemeType";
import { themeStore } from "./themeStore";

export const useThemedElement = <TElement extends keyof Theme>(
    elementType: TElement
): Theme[TElement] => {
    const { themeName } = useTheme();
    const plugin = themeStore.get(themeName) ?? htmlTheme;
    return plugin.components[elementType];
};
