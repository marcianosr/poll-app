import type { FormDataObject, TypedForm } from "@marcianosrs/form-schema";
import type { QuestionScoreResult } from "./poll-result";

type PlayerData = { id: string };

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
export type ScoreSystemPlugin<
    FormDefinition extends TypedForm,
    ScoreSystemData
> = {
    scoreSystemType: string;
    verifySettings: (
        settings: unknown
    ) => settings is FormDataObject<FormDefinition>;
    initializeSystemData: () => ScoreSystemData;

    editForm: FormDefinition;

    ScorePage: React.FC<{
        settings: FormDataObject<FormDefinition>;
        data: ScoreSystemData;
    }>;

    processResult: (
        score: QuestionScoreResult,
        player: PlayerData,
        settings: FormDataObject<FormDefinition>,
        systemData: ScoreSystemData
    ) => ScoreSystemData;
};
