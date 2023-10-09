import { formFieldPlugins } from "../field-plugins";
import { textFieldPlugin } from "./TextField";
import { titlePlugin } from "./Title";

formFieldPlugins.add(textFieldPlugin);
formFieldPlugins.add(titlePlugin);
