import { ThemePlugin } from "@marcianosrs/engine";
import { Button } from "./Button";
import { FormField } from "./FormField";
import { RangeSlider } from "./RangeSlider";
import { Table } from "./Table";
import { themeSettings } from "./themeSettings";
import { Theme } from "../../theming/ThemeType";

export const winterTheme: ThemePlugin<typeof themeSettings, Theme> = {
	name: "winter",
	displayName: "Spirit of Winter",
	description: "Celebrate the winter with this theme!",
	editForm: themeSettings,
	components: {
		button: Button,
		rangeSlider: RangeSlider,
		formField: FormField,
		table: Table,
	},
};
