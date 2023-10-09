import { formFieldPlugins } from "../field-plugins";
import { textFieldPlugin } from "./TextField";
import { numberFieldPlugin } from "./NumberField";
import { titlePlugin } from "./Title";
import { objectListPlugin } from "./ObjectList";

formFieldPlugins.add(textFieldPlugin);
formFieldPlugins.add(titlePlugin);
formFieldPlugins.add(numberFieldPlugin);
formFieldPlugins.add(objectListPlugin);
