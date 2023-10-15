import type { ThemePlugin } from "../../theming/types";
import { Button } from "./Button";
import { FormField } from "./FormField";
import { RangeSlider } from "./RangeSlider";
import { themeSettings } from "./themeSettings";

export const winterTheme: ThemePlugin<typeof themeSettings> = {
    name: "winter",
    displayName: "Spirit of Winter",
    description: "Celebrate the winter with this theme!",
    editForm: themeSettings,
    components: {
        button: Button,
        rangeSlider: RangeSlider,
        formField: FormField,
    },
};
