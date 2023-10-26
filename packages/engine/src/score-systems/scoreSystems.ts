import { TypedForm } from "@marcianosrs/form-schema";
import { createPluginStore } from "@marcianosrs/utils";
import { ScoreSystemPlugin } from "../types/score-system";

export const scoreSystemStore = createPluginStore<
    ScoreSystemPlugin<TypedForm, unknown>,
    unknown
>((p) => p.scoreSystemType);
