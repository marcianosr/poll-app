import { TypedForm } from "@marcianosrs/form-schema";
import { createPluginStore } from "@marcianosrs/utils";
import { RankingSystemPlugin } from "./types/ranking-system";

const rankingSystemStore = createPluginStore<
	RankingSystemPlugin<TypedForm, unknown>,
	unknown
>((p) => p.rankingSystemType);

// Here we can add different supporting score systems.
// The score goes in, and stores it in its own administrative system, and can render a page to display it.

// Some of the features handled by a score system:

// store score in a form in own administration
// Display that administration on a score page.

// Ranking can be determined from the score system.
// It could be based in points, time since opening, answering speed, teams or a combination.

export { rankingSystemStore };
