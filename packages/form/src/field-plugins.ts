import { createPluginStore } from "@marcianosrs/utils";
import { FormFieldPlugin } from "./types/field-plugin";
import { FieldType } from "./types/field-types";

export const formFieldPlugins = createPluginStore<
  FormFieldPlugin<FieldType<string>>,
  unknown
>((f) => f.fieldType);
