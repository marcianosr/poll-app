import { TypedForm } from "../form-schema/field-types";
import { FormDataObject } from "./form";
import { QuestionScoreResult } from "./poll-result";

export type ScoreSystemPlugin<
  FormDefinition extends TypedForm,
  ScoreSystemData
> = {
  scoreSystemType: string;
  verifySettings: (
    settings: unknown
  ) => settings is FormDataObject<FormDefinition>;

  editForm: FormDefinition;

  renderScorePage: () => Promise<
    React.FC<{
      settings: FormDataObject<FormDefinition>;
      data: ScoreSystemData;
    }>
  >;

  processResult: <Settings extends FormDataObject<FormDefinition>>(
    score: QuestionScoreResult,
    settings: Settings,
    systemData: ScoreSystemData
  ) => ScoreSystemData;
};
