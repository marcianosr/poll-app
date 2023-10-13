import type { ThemePlugin } from "../../theming/types";
import { Button } from "./Button";
import { themeSettings } from "./themeSettings";

export const winterTheme: ThemePlugin<typeof themeSettings> = {
    name: "winter",
    description: "Celebrate the winter with this theme!",
    editForm: themeSettings,
    components: {
        button: Button,
    },
};
