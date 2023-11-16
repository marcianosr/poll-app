import {
	type TypedForm,
	type FormDataObject,
	description,
} from "@marcianosrs/form-schema";
import type { PollScoreProcessorPlugin } from "../../types/poll-result";

const form = [
	description(
		"info",
		"You can use this plugin to double or half scores. The maximum able points to score will be modified as well."
	),
	{
		name: "multiplier",
		displayName: "Multiplier",
		valueType: "number",
		fieldType: "number",
		optional: false,
		defaultValue: 1,
		min: 0.1,
		max: 5.0,
	},
] as const satisfies TypedForm;

type MultiplierSettings = FormDataObject<typeof form>;

export const ScoreMultiplier: PollScoreProcessorPlugin<typeof form> = {
	processorType: "multiplier",
	displayName: "Score multiplier",
	verifySettings: (e): e is MultiplierSettings =>
		typeof e === "object" && e !== null && "multiplier" in e,
	editForm: form,
	processResult: (score, settings) => ({
		...score,
		rawPoints: score.rawPoints * settings.multiplier,
		maxPointsAvailable: score.maxPointsAvailable * settings.multiplier,
	}),
};
