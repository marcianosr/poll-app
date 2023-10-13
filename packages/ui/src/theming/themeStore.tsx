import { createPluginStore } from "@marcianosrs/utils";
import { ThemePlugin } from "./types";
import { TypedForm } from "@marcianosrs/form-schema";

export const themeStore = createPluginStore<ThemePlugin<TypedForm>>(
    (plugin) => plugin.name
);
