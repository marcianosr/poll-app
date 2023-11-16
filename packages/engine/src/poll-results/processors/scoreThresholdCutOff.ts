import {
	type TypedForm,
	type FormDataObject,
	description,
} from "@marcianosrs/form-schema";
import type { PollScoreProcessorPlugin } from "../../types/poll-result";

const form = [
	description(
		"info",
		"Use this plugin to limit the range of points. You could use this to prevent users to score negative points."
	),
	{
		name: "threshold",
		displayName: "Threshold",
		valueType: "number",
		fieldType: "number",
		optional: false,
		defaultValue: 0,
	},
	{
		name: "overUnder",
		displayName: "Over or under",
		valueType: "list",
		fieldType: "select",
		optional: false,
		options: [
			{ display: "Over", value: "over" },
			{ display: "Under", value: "under" },
		],
		defaultValue: "under",
	},
] as const satisfies TypedForm;

type ThresholdSettings = FormDataObject<typeof form>;

const updateScore = (points: number, settings: ThresholdSettings): number => {
	if (settings.overUnder === "over") {
		return points > settings.threshold ? settings.threshold : points;
	}
	return points < settings.threshold ? settings.threshold : points;
};

export const ScoreThresholdCutOff: PollScoreProcessorPlugin<typeof form> = {
	processorType: "thresholdCutOff",
	displayName: "Score clamping",
	verifySettings: (e): e is ThresholdSettings =>
		typeof e === "object" &&
		e !== null &&
		"threshold" in e &&
		"overUnder" in e,
	editForm: form,
	processResult: (score, settings) => ({
		...score,
		rawPoints: updateScore(score.rawPoints, settings),
	}),
};
