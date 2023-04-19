import { TextAreaField } from "~/ui/TextAreaField";
import { Text } from "~/ui/Text";
import { Mode, NewPollType } from "../PollForm";
import { Button } from "~/ui/Button";

type ExplanationSettingsContainerProps = {
	field: NewPollType;
	fields: NewPollType[];
	setFields: React.Dispatch<React.SetStateAction<NewPollType[]>>;
	mode: Mode;
};

export const ExplanationSettingsContainer = ({
	fields,
	setFields,
	mode,
	field,
}: ExplanationSettingsContainerProps) => {
	const onChangeExplanationField = (field: NewPollType, value: string) => {
		setFields([
			...fields.map((f) =>
				f.id === field.id
					? {
							...f,
							explanation: {
								...f.explanation,
								value,
							},
					  }
					: f
			),
		]);
	};

	return (
		<>
			<Text size="sm" variant="primary" tag="small">
				Additional explanation for the answer
			</Text>
			<section className="answer-settings-container">
				<TextAreaField
					placeholder={"Add explanation to answer"}
					disabled={mode === "mark"}
					name={`explanation-${field.id}`}
					id={field.id}
					value={field.explanation?.value || ""}
					onChange={(e) =>
						onChangeExplanationField(field, e.target.value)
					}
				/>
				<Button
					type="button"
					variant="submit"
					onClick={() => {
						setFields([
							...fields.map((f) =>
								f.id === field.id
									? {
											...f,
											explanation: null,
									  }
									: f
							),
						]);
					}}
				>
					Delete explanation
				</Button>
			</section>
		</>
	);
};
