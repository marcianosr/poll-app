import { themeStore } from "./theming/themeStore";
import { htmlTheme } from "./themes/html/theme";
import { winterTheme } from "./themes/winter/theme";

themeStore.add(htmlTheme);
themeStore.add(winterTheme);
