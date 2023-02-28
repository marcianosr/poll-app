import DeleteButton from "~/components/Button/DeleteButton";
import MarkButton from "~/components/Button/MarkButton";
import { TextAreaField } from "~/ui/TextAreaField";
import { BlockTypeToggleButton } from "../BlockTypeToggleButton";
import { CorrectAnswerType, Mode, NewPollType } from "../PollForm";
import styles from "./styles.css";

type AnswerSettingsContainerProps = {
	field: NewPollType;
	fields: NewPollType[];
	addField: () => void;
	setFields: React.Dispatch<React.SetStateAction<NewPollType[]>>;
	markCorrectAnswer: CorrectAnswerType[];
	mode: Mode;
	setMarkCorrectAnswer: React.Dispatch<
		React.SetStateAction<CorrectAnswerType[]>
	>;
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const AnswerSettingsContainer = ({
	field,
	fields,
	addField,
	setFields,
	markCorrectAnswer,
	mode,
	setMarkCorrectAnswer,
}: AnswerSettingsContainerProps) => {
	const onChangeField = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
		field: NewPollType
	) =>
		setFields([
			...fields.map((f) =>
				f.id === field.id
					? {
							...f,
							value: e.target.value,
					  }
					: f
			),
		]);

	const onCMDAndEnterPressed: React.KeyboardEventHandler = (e) => {
		if (e.metaKey && e.key === "Enter") addField();
	};

	return (
		<section className="answer-settings-container" key={field.id}>
			<TextAreaField
				isValid={
					!!markCorrectAnswer.find((item) => item.id === field.id)
				}
				placeholder={field.placeholder || ""}
				disabled={mode === "mark"}
				name={`answer-${field.id}`}
				id={field.id}
				value={field.value || ""}
				autoFocus={field.autoFocus}
				onKeyDown={(e) => onCMDAndEnterPressed(e)}
				onChange={(e) => onChangeField(e, field)}
			/>
			<BlockTypeToggleButton
				blockType={field.blockType}
				setFields={setFields}
				field={field}
				fields={fields}
			/>
			{fields.length > 1 && mode === "edit" && (
				<DeleteButton
					fieldId={field.id}
					fields={fields}
					setFields={setFields}
				/>
			)}

			{mode === "mark" && (
				<MarkButton
					markCorrectAnswer={markCorrectAnswer}
					setMarkCorrectAnswer={setMarkCorrectAnswer}
					field={field}
				/>
			)}
		</section>
	);
};
