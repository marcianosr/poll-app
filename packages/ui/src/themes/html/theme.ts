import { FormDataObject, TypedForm } from "@marcianosrs/form-schema";
import { ThemePlugin } from "../../theming/types";
import { Button } from "./Button";

const themeSettings = [] as const satisfies TypedForm;

export const htmlTheme: ThemePlugin<typeof themeSettings> = {
    name: "html",
    description: "This is the most unstyled fallback theme",
    editForm: themeSettings,
    components: {
        button: Button,
    },
    verifySettings: (e: unknown): e is FormDataObject<typeof themeSettings> =>
        true,
};
