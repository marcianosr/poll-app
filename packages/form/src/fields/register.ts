import { formFieldPlugins } from "../field-plugins";
import { textFieldPlugin } from "./TextField";
import { numberFieldPlugin } from "./NumberField";
import { titlePlugin } from "./Title";
import { objectListPlugin } from "./ObjectList";
import { colorFieldPlugin } from "./ColorField";

formFieldPlugins.add(textFieldPlugin);
formFieldPlugins.add(titlePlugin);
formFieldPlugins.add(colorFieldPlugin);
formFieldPlugins.add(numberFieldPlugin);
formFieldPlugins.add(objectListPlugin);
