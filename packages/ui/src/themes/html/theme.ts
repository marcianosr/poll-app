import type { TypedForm } from "@marcianosrs/form-schema";
import type { ThemePlugin } from "../../theming/types";
import { Button } from "./Button";

const themeSettings = [] as const satisfies TypedForm;

export const htmlTheme: ThemePlugin<typeof themeSettings> = {
    name: "html",
    displayName: "Base",
    description: "This is the most unstyled fallback theme",
    editForm: themeSettings,
    components: {
        button: Button,
    },
};
