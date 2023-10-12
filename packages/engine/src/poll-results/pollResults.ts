import type { TypedForm } from "@marcianosrs/form-schema";
import { createPluginStore } from "@marcianosrs/utils";
import type { PollScoreProcessorPlugin } from "../types/poll-result";

export const scoreProcessorStore = createPluginStore<
    PollScoreProcessorPlugin<TypedForm>
>((p) => p.processorType);
