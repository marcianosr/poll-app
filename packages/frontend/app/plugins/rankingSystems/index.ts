import { rankingSystemStore } from "@marcianosrs/engine";
import { pointRankingSystem } from "./pointRankingSystem";

export const registerRankingPlugins = () => {
	rankingSystemStore.add(pointRankingSystem);
};
