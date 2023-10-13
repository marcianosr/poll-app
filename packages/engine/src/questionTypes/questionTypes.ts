import type { TypedForm } from "@marcianosrs/form-schema";
import { createPluginStore } from "@marcianosrs/utils";
import type { PollQuestionPlugin } from "../types/poll";

export type GenericPollQuestionPlugin = PollQuestionPlugin<
    TypedForm,
    Record<string, unknown>
>;

export const questionTypeStore = createPluginStore<GenericPollQuestionPlugin>(
    (p) => p.contentType
);
