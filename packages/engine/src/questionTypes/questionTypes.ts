import { createPluginStore } from "../generic/pluginStore";
import { PollQuestionPlugin } from "../types/poll";

export type GenericPollQuestionPlugin = PollQuestionPlugin<
  Record<string, unknown>,
  Record<string, unknown>
>;

export const questionTypeStore = createPluginStore<GenericPollQuestionPlugin>(
  (p) => p.contentType
);
