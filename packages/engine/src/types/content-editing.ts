/**
 * There are different choices to make here:
 *
 * One could be:
 * - Editing as component, where the component is something build by the plugin developer,
 * designing the form and editing capabilities.
 *  The developer has most freedom, but needs to take care about
 *  validations, responsive design, consistent look, etc.
 *
 * Another option could be:
 *
 * - The developer just defines an elaborate form schema, describing the data and fields.
 *   The system takes care of validation and rendering. (Easier for developers? less mistakes?)
 *   Custom form fields could maybe still be made as separate plugins, or inline plugins in the schema?
 *
 */

export type Editor<T extends Record<string, unknown>> = EditorAsComponent<T>; // | EditorWithSchema<T>

//export type EditorWithSchema<T extends Record<string, unknown>> = FormSchemaFor<T>;

export type SettingsEditComponent<T extends Record<string, unknown>> =
  React.FC<{
    data: T;
    onUpdate: (updatedData: T) => void;
  }>;

export type EditorAsComponent<T extends Record<string, unknown>> =
  () => Promise<SettingsEditComponent<T>>;
