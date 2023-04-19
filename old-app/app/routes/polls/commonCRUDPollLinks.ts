import { links as commonStyleLinks } from "../polls/commonStyleLinks";
import { links as answerSettingsContainerLinks } from "~/admin/components/AnswersSettingsContainer";
import { links as pollSettingsLinks } from "~/admin/components/PollSettingsContainer";
import { links as addAnswerButtonLinks } from "~/admin/components/AddAnswerButton";
import { links as pointsInputFieldLinks } from "~/admin/components/PointsInputField";

export function links() {
	return [
		...commonStyleLinks(),
		...answerSettingsContainerLinks(),
		...pollSettingsLinks(),
		...addAnswerButtonLinks(),
		...pointsInputFieldLinks(),
	];
}
