import type { FormDataObject, TypedForm } from "@marcianosrs/form-schema";
import type { QuestionScoreResult } from "./poll-result";
import { ContentIdentifier } from "./identifiers";
import { TimestampDTO } from "../types";

type PlayerData = { id: string };

export type RankingSystemDTO = {
	id: ContentIdentifier;
	startedAt: TimestampDTO | null;
	closedAt: TimestampDTO | null;
	content: Record<string, unknown> | unknown[] | undefined | null;
};

/**
 * Score systems define how ranking works.
 *
 * They process the `QuestionScoreResult` with player data into their own defined
 * `ScoreSystemData`.
 *
 * The plugin can then based on the ScoreSystemData show a highscore page, that could be based on:
 *
 * - Teams
 * - Points
 * - Time
 * - Streak
 *
 */
export type RankingSystemPlugin<
	FormDefinition extends TypedForm,
	RankingSystemData
> = {
	rankingSystemType: string;
	displayName: string;
	verifySettings: (
		settings: unknown
	) => settings is FormDataObject<FormDefinition>;
	initializeSystemData: () => RankingSystemData;

	editForm: FormDefinition;

	RankingPage: React.FC<{
		settings: FormDataObject<FormDefinition>;
		data: RankingSystemData;
	}>;

	processResult: (
		score: QuestionScoreResult,
		player: PlayerData,
		settings: FormDataObject<FormDefinition>,
		systemData: RankingSystemData
	) => RankingSystemData;
};
