import { colorFieldPlugin } from "./ColorField";
import { formFieldPlugins } from "../field-plugins";
import { hiddenFieldPlugin } from "./HiddenField";
import { numberFieldPlugin } from "./NumberField";
import { objectFieldPlugin } from "./ObjectField";
import { objectListPlugin } from "./ObjectList";
import { pluginFieldPlugin } from "./PluginField";
import { rangeSliderPlugin } from "./RangeSlider";
import { selectFieldPlugin } from "./SelectField";
import { textFieldPlugin } from "./TextField";
import { titlePlugin } from "./Title";
import { checkboxPlugin } from "./Checkbox";
import { autoCompleteTextFieldPlugin } from "./AutocompleteTextField";

formFieldPlugins.add(colorFieldPlugin);
formFieldPlugins.add(hiddenFieldPlugin);
formFieldPlugins.add(numberFieldPlugin);
formFieldPlugins.add(objectFieldPlugin);
formFieldPlugins.add(objectListPlugin);
formFieldPlugins.add(pluginFieldPlugin);
formFieldPlugins.add(rangeSliderPlugin);
formFieldPlugins.add(selectFieldPlugin);
formFieldPlugins.add(textFieldPlugin);
formFieldPlugins.add(titlePlugin);
formFieldPlugins.add(checkboxPlugin);
formFieldPlugins.add(autoCompleteTextFieldPlugin);
