import { formFieldPlugins } from "../field-plugins";
import { textFieldPlugin } from "./TextField";
import { numberFieldPlugin } from "./NumberField";
import { titlePlugin } from "./Title";
import { objectListPlugin } from "./ObjectList";
import { objectFieldPlugin } from "./ObjectField";
import { colorFieldPlugin } from "./ColorField";
import { selectFieldPlugin } from "./SelectField";
import { hiddenFieldPlugin } from "./HiddenField";

formFieldPlugins.add(textFieldPlugin);
formFieldPlugins.add(titlePlugin);
formFieldPlugins.add(colorFieldPlugin);
formFieldPlugins.add(numberFieldPlugin);
formFieldPlugins.add(objectListPlugin);
formFieldPlugins.add(objectFieldPlugin);
formFieldPlugins.add(selectFieldPlugin);
formFieldPlugins.add(hiddenFieldPlugin);
