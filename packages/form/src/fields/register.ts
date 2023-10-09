import { formFieldPlugins } from "../field-plugins";
import { textFieldPlugin } from "./TextField";
import { numberFieldPlugin } from "./NumberField";
import { titlePlugin } from "./Title";

formFieldPlugins.add(textFieldPlugin);
formFieldPlugins.add(titlePlugin);
formFieldPlugins.add(numberFieldPlugin);
