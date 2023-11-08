import { createPluginStore } from "@marcianosrs/utils";
import { TypedForm } from "@marcianosrs/form-schema";

export type ThemePlugin<TFormDefinition extends TypedForm, Theme> = {
	name: string;
	displayName: string;
	description: string;
	editForm: TFormDefinition;
	components: Theme;
};

export const themeStore = createPluginStore<
	ThemePlugin<TypedForm, { [x: string]: unknown }>
>((plugin) => plugin.name);
