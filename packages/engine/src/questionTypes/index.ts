import type { TypedForm } from "@marcianosrs/form-schema";
import { createPluginStore } from "@marcianosrs/utils";
import type { PollQuestionPlugin } from "../types/poll";
import { pollQuestion } from "./pollQuestionPlugin";
import { memoryQuestion } from "./memoryQuestionPlugin";

export type GenericPollQuestionPlugin = PollQuestionPlugin<
	TypedForm,
	Record<string, unknown>
>;

const questionTypeStore = createPluginStore<GenericPollQuestionPlugin, unknown>(
	(p) => p.contentType
);

questionTypeStore.add(pollQuestion);
questionTypeStore.add(memoryQuestion);

export { questionTypeStore };
