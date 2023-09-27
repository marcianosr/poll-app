import { Editor } from "./content-editing";
import { ContentIdentifier } from "./identifiers";

/**
 * Theme adjust the looks and terminology of the website.
 */
export type Theme<ThemeConfigData extends Record<string, unknown>> = {
  id: ContentIdentifier;
  name: string;
  internalThemeId: string;

  config: ThemeConfigData; // Could contain theme specific settings, like colors, terminology, etc.
};

export type ThemePlugin<ThemeConfigData extends Record<string, unknown>> = {
  theme: string;
  verifyContent: (settings: unknown) => ThemeConfigData | false;

  EditTheme: Editor<ThemeConfigData>;

  /**
   * Not yet sure what other function should go in here. We need to experiment with 'themed' components first
   */
};
