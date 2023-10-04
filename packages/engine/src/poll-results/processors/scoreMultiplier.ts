import { TypedForm, FormDataObject } from "@marcianosrs/form";
import { PollScoreProcessorPlugin } from "../../types/poll-result";

const form = [
  { name: "multiplier", displayName: "multiplier", valueType: "number", fieldType: "number", optional: false, defaultValue: 1, min: 0.1, max: 5.0 },
] as const satisfies TypedForm;

type MultiplierSettings = FormDataObject<typeof form>;

export const ScoreMultiplier: PollScoreProcessorPlugin<typeof form> = {
  processorType: "multiplier",
  verifySettings: (e): e is MultiplierSettings =>
    typeof e === "object" && e !== null && "multiplier" in e,
  editForm: form,
  processResult: (score, settings) => ({
    ...score,
    rawPoints: score.rawPoints * settings.multiplier,
  }),
};
