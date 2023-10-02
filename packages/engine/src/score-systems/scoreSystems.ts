import { TypedForm } from "../form-schema/field-types";
import { createPluginStore } from "../generic/pluginStore";
import { ScoreSystemPlugin } from "../types/score-system";

export const scoreSystemStore = createPluginStore<
  ScoreSystemPlugin<TypedForm, unknown>
>((p) => p.scoreSystemType);
