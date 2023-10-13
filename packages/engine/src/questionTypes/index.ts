import type { TypedForm } from "@marcianosrs/form-schema";
import { createPluginStore } from "@marcianosrs/utils";
import type { PollQuestionPlugin } from "../types/poll";
import { pollQuestion } from "./pollQuestionPlugin";

export type GenericPollQuestionPlugin = PollQuestionPlugin<
    TypedForm,
    Record<string, unknown>
>;

export const questionTypeStore = createPluginStore<
    GenericPollQuestionPlugin,
    unknown
>((p) => p.contentType);

questionTypeStore.add(pollQuestion);
