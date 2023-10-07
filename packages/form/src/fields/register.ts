import { formFieldPlugins } from "../field-plugins";
import { FormFieldPlugin } from "../types/field-plugin";
import { FieldType, TextField } from "../types/field-types";

const textFieldPlugin: FormFieldPlugin<TextField<string>> = {
  fieldType: "text",
  Component: () => import("./TextField"),
};
formFieldPlugins.add(textFieldPlugin as FormFieldPlugin<FieldType<string>>);
