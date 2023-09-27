import { Editor } from "./content-editing";
import { ContentIdentifier, Milliseconds } from "./identifiers";

export type QuestionScoreResult = {
  rawPoints: number;
  maxPointsAvailable: number;

  timeTaken: Milliseconds;
  timeSinceQuestion: Milliseconds;

  answeredOrderNumber: number; // 0 if you are the first to answer the question
  answeredOrderNumberCorrect: number; // 0 if you are the first to answer the question correctly (raw == maxPoints)
};

/**
 * Score mutator could:
 *
 * - Duplicate score
 * - Half the score
 * - Pick all wrong answers instead of right ones ? 'reverse' (how? can this be applied to all 'question types?')
 */
export type QuestionScoreMutator<T extends Record<string, unknown>> = {
  id: ContentIdentifier;
  name: string;
  internalMutatorId: string;

  config: T; // Settings like 'multiplier value'
};

export type PollScoreProcessorPlugin<
  ProcessorSettings extends Record<string, unknown>
> = {
  processorType: string;
  verifySettings: (settings: unknown) => settings is ProcessorSettings;
  defaultSettings: () => ProcessorSettings;

  EditProcessor: Editor<ProcessorSettings>;

  processResult: (
    score: QuestionScoreResult,
    settings: ProcessorSettings
  ) => QuestionScoreResult;
};
