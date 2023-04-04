import { links as textFieldLinks } from "../../ui/TextAreaField";
import { links as inputFieldLinks } from "../../ui/InputField";
import { links as buttonLinks } from "../../ui/Button";
import { links as titleLinks } from "~/ui/Title";
import { links as textLinks } from "~/ui/Text";
import { links as fieldsetLinks } from "~/ui/Fieldset";

export function links() {
	return [
		...inputFieldLinks(),
		...textFieldLinks(),
		...fieldsetLinks(),
		...buttonLinks(),
		...titleLinks(),
		...textLinks(),
	];
}
