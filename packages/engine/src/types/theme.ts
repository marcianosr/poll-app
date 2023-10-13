import type { FormDataObject, TypedForm } from "@marcianosrs/form-schema";
import type { ContentIdentifier } from "./identifiers";

/**
 * Theme adjust the looks and terminology of the website.
 */
export type Theme<ThemeConfigData extends Record<string, unknown>> = {
    id: ContentIdentifier;
    name: string;
    internalThemeId: string;

    config: ThemeConfigData; // Could contain theme specific settings, like colors, terminology, etc.
};

export type ThemePlugin<FormDefinition extends TypedForm> = {
    theme: string;
    verifyContent: (
        settings: unknown
    ) => FormDataObject<FormDefinition> | false;

    editForm: FormDefinition;

    /**
     * Not yet sure what other function should go in here. We need to experiment with 'themed' components first
     */
};
