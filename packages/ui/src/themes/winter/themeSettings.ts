import {
    FormDataObject,
    TypedForm,
    schemaToDefaultValues,
} from "@marcianosrs/form-schema";
import { useTheme } from "../../theming/ThemeContext";

export const themeSettings = [
    {
        displayName: "Snow",
        name: "snow",
        valueType: "boolean",
        fieldType: "checkbox",
        defaultValue: false,
        optional: false,
    },
] as const satisfies TypedForm;

type WinterThemeSettings = FormDataObject<typeof themeSettings>;

const isWinterThemeSettings = (e: unknown): e is WinterThemeSettings =>
    typeof e === "object" && e !== null && "snow" in e;

export const useThemeSettings = (): WinterThemeSettings => {
    const { themeName, settings } = useTheme();

    if (themeName === "winter" && isWinterThemeSettings(settings)) {
        return settings;
    }
    return schemaToDefaultValues(themeSettings) as WinterThemeSettings;
};
