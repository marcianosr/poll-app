import { PollQuestionPlugin } from "../types/poll";

export type GenericPollQuestionPlugin = PollQuestionPlugin<
  Record<string, unknown>,
  Record<string, unknown>
>;

export const questionTypes = () => {
  const plugins: GenericPollQuestionPlugin[] = [];

  return {
    addQuestionType: <Plugin extends GenericPollQuestionPlugin>(
      type: Plugin
    ) => {
      plugins.push(type);
    },
    getQuestionType: (
      questionType: string
    ): GenericPollQuestionPlugin | undefined =>
      plugins.find((e) => e.contentType === questionType),
  };
};
