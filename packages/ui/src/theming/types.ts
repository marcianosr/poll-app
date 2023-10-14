import { TypedForm } from "@marcianosrs/form-schema";
import { Theme } from "./ThemeType";

export type ThemePlugin<TFormDefinition extends TypedForm> = {
    name: string;
    displayName: string;
    description: string;
    editForm: TFormDefinition;
    components: Theme;
};
