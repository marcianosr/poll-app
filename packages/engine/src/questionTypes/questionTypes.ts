import { TypedForm } from "@marcianosrs/form";
import { createPluginStore } from "@marcianosrs/utils";
import { PollQuestionPlugin } from "../types/poll";

export type GenericPollQuestionPlugin = PollQuestionPlugin<
  TypedForm,
  Record<string, unknown>
>;

export const questionTypeStore = createPluginStore<GenericPollQuestionPlugin>(
  (p) => p.contentType
);
