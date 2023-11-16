import { QuestionScoreResult } from "../../types/poll-result";

export const createFactory =
	<T>(base: T) =>
	(options?: Partial<T>): T => ({ ...base, ...options });

const BASE_SCORE_RESULT: QuestionScoreResult = {
	answeredOrderNumber: 0,
	answeredOrderNumberCorrect: 0,
	rawPoints: 0,
	maxPointsAvailable: 10,
	questionDifficulty: 2,
	timeSinceQuestion: 20_000,
	timeTaken: 5_000,
};

export const createScoreResult = createFactory(BASE_SCORE_RESULT);
