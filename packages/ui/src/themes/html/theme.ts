import type { TypedForm } from "@marcianosrs/form-schema";
import type { ThemePlugin } from "../../theming/types";
import { Button } from "./Button";
import { RangeSlider } from "./RangeSlider";

const themeSettings = [] as const satisfies TypedForm;

export const htmlTheme: ThemePlugin<typeof themeSettings> = {
	name: "html",
	description: "This is the most unstyled fallback theme",
	editForm: themeSettings,
	components: {
		button: Button,
		rangeSlider: RangeSlider,
	},
};
