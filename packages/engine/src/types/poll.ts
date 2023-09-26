import { ContentIdentifier, UserId } from "./identifiers";

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
  result: AnswerData;
  rawAnswerScore: number; // percentage
  timeUsed: number;
  scorePluginsActive: ContentIdentifier[];
};

export type PollQuestionPlugin<
  QuestionData extends Record<string, unknown>,
  AnswerData extends Record<string, unknown>
> = {
  contentType: string;
  verifyContent: (settings: unknown) => QuestionData | false;

  EditQuestion: () => Promise<
    React.FC<{
      settings: QuestionData;
      onUpdate: (newSettings: QuestionData) => void;
    }>
  >;
  ShowQuestion: () => Promise<
    React.FC<{
      settings: QuestionData;
      mode: "preview" | "answer" | "result";
      pollUserResults?: PollUserResult<AnswerData>[];
      onAnswer?: (
        data: AnswerData,
        rawAnswerScore: number,
        timeUsed: number
      ) => void;
    }>
  >;
};
