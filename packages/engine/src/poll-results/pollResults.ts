import { createPluginStore } from "../generic/pluginStore";
import { PollScoreProcessorPlugin } from "../types/poll-result";

export type GenericQuestionScoreMutator<
  T extends Record<string, unknown> = Record<string, unknown>
> = PollScoreProcessorPlugin<T>;

export const scoreProcessorStore =
  createPluginStore<GenericQuestionScoreMutator>((p) => p.processorType);
