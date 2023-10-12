import { TypedForm, FormDataObject } from "@marcianosrs/form-schema";
import { Theme } from "./ThemeType";

export type ThemePlugin<TFormDefinition extends TypedForm> = {
    name: string;
    description: string;
    editForm: TFormDefinition;
    components: Theme;
    verifySettings: (
        settings: unknown
    ) => settings is FormDataObject<TFormDefinition>;
};
