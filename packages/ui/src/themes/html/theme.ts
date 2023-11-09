import type { TypedForm } from "@marcianosrs/form-schema";
import { Button } from "./Button";
import { RangeSlider } from "./RangeSlider";
import { FormField } from "./FormField";
import { Table } from "./Table";
import { ThemePlugin } from "@marcianosrs/engine";
import { Theme } from "../../theming/ThemeType";

const themeSettings = [] as const satisfies TypedForm;

export const htmlTheme: ThemePlugin<typeof themeSettings, Theme> = {
	name: "html",
	displayName: "Base theme",
	description: "This is the most unstyled fallback theme",
	editForm: themeSettings,
	components: {
		button: Button,
		rangeSlider: RangeSlider,
		formField: FormField,
		table: Table,
	},
};
