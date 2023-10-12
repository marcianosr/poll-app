import { TypedForm } from "@marcianosrs/form";
import { createPluginStore } from "../generic/pluginStore";
import { ScoreSystemPlugin } from "../types/score-system";

export const scoreSystemStore = createPluginStore<
  ScoreSystemPlugin<TypedForm, unknown>
>((p) => p.scoreSystemType);
