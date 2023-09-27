import { scoreProcessorStore } from "./pollResults";
import { ScoreMultiplier } from "./processors/scoreMultiplier";

scoreProcessorStore.add(ScoreMultiplier);

export default scoreProcessorStore;
