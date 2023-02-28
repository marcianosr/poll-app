import { links as textFieldLinks } from "../../ui/TextAreaField";
import { links as inputFieldLinks } from "../../ui/InputField";
import { links as buttonLinks } from "../../ui/Button";
import { links as answerSettingsContainerLinks } from "~/admin/components/AnswersSettingsContainer";
import { links as pollSettingsLinks } from "~/admin/components/PollSettingsContainer";
import { links as titleLinks } from "~/ui/Title";
import { links as textLinks } from "~/ui/Text";
import { links as addAnswerButtonLinks } from "~/admin/components/AddAnswerButton";

export function links() {
	return [
		...inputFieldLinks(),
		...textFieldLinks(),
		...buttonLinks(),
		...answerSettingsContainerLinks(),
		...pollSettingsLinks(),
		...titleLinks(),
		...textLinks(),
		...addAnswerButtonLinks(),
	];
}
