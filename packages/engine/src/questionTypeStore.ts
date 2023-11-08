import type { TypedForm } from "@marcianosrs/form-schema";
import { createPluginStore } from "@marcianosrs/utils";
import type { PollQuestionPlugin } from "./types/poll";

export type GenericPollQuestionPlugin = PollQuestionPlugin<
	TypedForm,
	Record<string, unknown>
>;

const questionTypeStore = createPluginStore<GenericPollQuestionPlugin, unknown>(
	(p) => p.contentType
);

export { questionTypeStore };
