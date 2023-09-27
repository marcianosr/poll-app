import { SettingsEditComponent } from "../../types/content-editing";
import { PollScoreProcessorPlugin } from "../../types/poll-result";

type MultiplierSettings = {
  multiplier: number;
};

const EditProcessorComponent: SettingsEditComponent<MultiplierSettings> = ({
  data,
  onUpdate,
}) => {
  <input
    value={data.multiplier}
    onChange={(event) => {
      onUpdate({ multiplier: event.target.valueAsNumber });
    }}
  />;
};

export const ScoreMultiplier: PollScoreProcessorPlugin<MultiplierSettings> = {
  processorType: "multiplier",
  defaultSettings: () => ({ multiplier: 1 }),
  verifySettings: (e): e is MultiplierSettings =>
    typeof e === "object" && "multiplier" in e,
  EditProcessor: async () => EditProcessorComponent,
  processResult: (score, settings) => ({
    ...score,
    rawPoints: score.rawPoints * settings.multiplier,
  }),
};
