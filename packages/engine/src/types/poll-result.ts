import type { FormDataObject, TypedForm } from "@marcianosrs/form-schema";
import type { ContentIdentifier, Milliseconds } from "./identifiers";

type Percentage = number;

export type QuestionScoreResult = {
	rawPoints: number;
	questionDifficulty: Percentage;
	maxPointsAvailable: number;

	timeTaken: Milliseconds;
	timeSinceQuestion: Milliseconds;

	answeredOrderNumber: number; // 0 if you are the first to answer the question
	/**
	 * 0 if you are the first to answer the question correctly (raw == maxPoints)
	 * null if you did not answer correctly
	 */
	answeredOrderNumberCorrect: number | null;
};

/**
 * Question mutator could:
 *
 * - Make questions time based
 * - Pick all wrong answers instead of right ones ? 'reverse' (how? can this be applied to all 'question types?')
 * - Shuffle answer options
 * - Flip screen upside down?
 */
export type QuestionMutator<T extends Record<string, unknown>> = {
	id: ContentIdentifier;
	name: string;
	internalMutatorId: string;

	config: T; // Settings like 'multiplier value'
};

/**
 * Score mutator could:
 *
 * - Duplicate score
 * - Half the score
 * - Cut off score based on time
 * - Duplicate score if you are first one correct
 *
 */
export type PollScoreProcessorPlugin<FormDefinition extends TypedForm> = {
	processorType: string;
	verifySettings: (
		settings: unknown
	) => settings is FormDataObject<FormDefinition>;

	editForm: FormDefinition;

	processResult: <Settings extends FormDataObject<FormDefinition>>(
		score: QuestionScoreResult,
		settings: Settings
	) => QuestionScoreResult;
};
