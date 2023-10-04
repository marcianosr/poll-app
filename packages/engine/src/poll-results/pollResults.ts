import { TypedForm } from "@marcianosrs/form";
import { createPluginStore } from "../generic/pluginStore";
import { PollScoreProcessorPlugin } from "../types/poll-result";

export const scoreProcessorStore = createPluginStore<
  PollScoreProcessorPlugin<TypedForm>
>((p) => p.processorType);
