import { formFieldPlugins } from "../field-plugins";
import { FormFieldPlugin } from "../types/field-plugin";
import { FieldType } from "../types/field-types";
import { textFieldPlugin } from "./TextField";

formFieldPlugins.add(textFieldPlugin as FormFieldPlugin<FieldType<string>>);
