import { TypedForm } from "../form-schema/field-types";
import { Editor } from "./content-editing";
import { FormDataObject } from "./form";
import { ContentIdentifier, UserId } from "./identifiers";
import { QuestionScoreResult } from "./poll-result";

export type PollQuestion<QuestionData extends Record<string, unknown>> = {
  id: ContentIdentifier;
  submitter: UserId;
  created: Date;
  status: "draft" | "approved";

  content: QuestionData;
  contentType: string;
  tags: string[];
};

export type QuestionFeedback = {
  questionId: ContentIdentifier;
  feedbackType: "confusing";
  details: string;
  resolved: boolean;
};

export type PollItem = {
  id: ContentIdentifier;
  channelId: ContentIdentifier;
  orderId: number;
  status: "closed" | "open" | "upcoming";
  questionId: ContentIdentifier;
};

export type PollUserResult<AnswerData extends Record<string, unknown>> = {
  pollId: ContentIdentifier;
  questionId: ContentIdentifier;
  userId: UserId;
  questionResult: AnswerData;

  originalScoreResult: QuestionScoreResult;
  // After the scorePlugins have mutated the result
  processedScoreResult: QuestionScoreResult;
  scorePluginsActive: ContentIdentifier[];
};

export type PollQuestionPlugin<
  FormDefinition extends TypedForm,
  AnswerData extends Record<string, unknown>
> = {
  contentType: string;
  verifySettings: (
    settings: unknown
  ) => settings is FormDataObject<FormDefinition>;
  defaultSettings: () => FormDataObject<FormDefinition>;

  editForm: FormDefinition;

  ShowQuestion: () => Promise<
    React.FC<{
      settings: FormDataObject<FormDefinition>;
      mode: "preview" | "answer" | "result";
      pollUserResults?: PollUserResult<AnswerData>[];
      onAnswer?: (data: AnswerData, result: QuestionScoreResult) => void;
    }>
  >;
};
