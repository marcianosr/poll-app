import { createPluginStore } from "@marcianosrs/utils";
import type { FormFieldPlugin } from "./types/field-plugin";
import type { FieldType } from "@marcianosrs/form-schema";

export const formFieldPlugins = createPluginStore<
    FormFieldPlugin<FieldType<string>>,
    unknown
>((f) => f.fieldType);
