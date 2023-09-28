import { TypedForm } from "../form-schema/field-types";
import { Editor } from "./content-editing";
import { FormDataObject } from "./form";
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

export type PollScoreProcessorPlugin<FormDefinition extends TypedForm> = {
  processorType: string;
  verifySettings: (
    settings: unknown
  ) => settings is FormDataObject<FormDefinition>;
  defaultSettings: () => FormDataObject<FormDefinition>;

  editForm: FormDefinition;

  processResult: <Settings extends FormDataObject<FormDefinition>>(
    score: QuestionScoreResult,
    settings: Settings
  ) => QuestionScoreResult;
};
