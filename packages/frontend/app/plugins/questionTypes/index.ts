import { questionTypeStore } from "@marcianosrs/engine";
import { pollQuestion } from "./pollQuestionPlugin";

export const registerQuestionPlugins = () => {
	questionTypeStore.add(pollQuestion);
};
