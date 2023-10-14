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
        fieldType: "range",
        valueType: "number",
        defaultValue: 0,
        min: 0,
        max: 1,
        step: 0.1,
        optional: false,
        labels: [
            { title: "No snow", value: 0 },
            { title: "Light snow", value: 0.1 },
            { title: "Heavy snow", value: 1 },
        ],
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
