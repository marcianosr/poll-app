import { scoreProcessorStore } from "./pollResults";
import { ScoreMultiplier } from "./processors/scoreMultiplier";
import { ScoreThresholdCutOff } from "./processors/scoreThresholdCutOff";

scoreProcessorStore.add(ScoreMultiplier);
scoreProcessorStore.add(ScoreThresholdCutOff);

export default scoreProcessorStore;
