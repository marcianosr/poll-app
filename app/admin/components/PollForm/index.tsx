import { Form, useActionData } from "@remix-run/react";
import { v4 as uuidv4 } from "uuid";
import type { FC } from "react";
import { useEffect, useState } from "react";
import type { Explanation, InputTypes, PollData } from "~/utils/polls";
import { useAuth } from "~/providers/AuthProvider";
import { TextAreaField } from "../../../ui/TextAreaField";
import { InputField } from "../../../ui/InputField";
import { Button } from "~/ui/Button";
import { AnswerSettingsContainer } from "../AnswersSettingsContainer";
import { PollSettingsContainer } from "../PollSettingsContainer";
import { AddAnswerButton } from "../AddAnswerButton";
import { AddExplanationFieldButton } from "../AddExplanationFieldButton";
import { ExplanationSettingsContainer } from "../ExplanationSettingsContainer";
import { PointsInputField } from "../PointsInputField";
import { Fieldset } from "~/ui/Fieldset";

export type BlockType = "text" | "code";
export type NewPollType = {
	id: string;
	type?: InputTypes;
	blockType?: BlockType;
	placeholder?: string;
	value?: string;
	autoFocus?: boolean;
	explanation: Explanation | null;
	points: number;
};
export type CorrectAnswerType = {
	id: string;
	value: string;
};
export type Mode = "edit" | "mark";
export type Errors = {
	[key: string]: boolean;
};
type Data =
	| ({ ok: boolean } & PollData)
	| { ok: boolean; errors: Errors }
	| undefined;
type Props = {
	poll?: PollData;
};

const PollForm: FC<Props> = ({ poll }) => {
	const action: Data = useActionData();
	const { user, isAdmin } = useAuth();

	const [mode, setMode] = useState<Mode>("edit");

	const [fields, setFields] = useState<NewPollType[]>([
		{
			id: "eioozak-ojnab",
			type: "radio",
			blockType: "text",
			placeholder: "Add option",
			value: "",
			autoFocus: false,
			explanation: null,
			points: 0,
		},
	]);

	const pointsPerField = fields.reduce((acc, f) => acc + f.points, 0);

	const [markCorrectAnswer, setMarkCorrectAnswer] = useState<
		CorrectAnswerType[]
	>((poll && poll?.correctAnswers) || []);

	const [pollType, setPollType] = useState<"radio" | "checkbox">(
		poll?.type || markCorrectAnswer.length > 1 ? "checkbox" : "radio"
	);

	useEffect(() => {
		setPollType(markCorrectAnswer.length > 1 ? "checkbox" : "radio");
	}, [pollType, markCorrectAnswer]);

	useEffect(() => {
		if (poll?.answers) setFields(poll?.answers);
	}, [poll?.answers]);

	const addField = () => {
		setFields([
			...fields.map((field) => ({
				...field,
				autoFocus: false,
			})),
			{
				id: uuidv4(),
				type: "radio",
				blockType: "text",
				placeholder: `Add option`,
				value: "",
				autoFocus: true,
				explanation: null,
				points: 0,
			},
		]);
	};

	const addExplanationField = (field: NewPollType) => {
		setFields([
			...fields.map((f) =>
				f.id === field.id
					? {
							...f,
							explanation: {
								...f.explanation,
								value: "",
							},
					  }
					: f
			),
		]);
	};

	return (
		<section>
			<Form method="post" className="form">
				<section className="questions-and-answers">
					<TextAreaField
						name="question"
						placeholder="Question"
						value={poll?.question || ""}
						autoFocus={true}
					/>

					<input
						type="hidden"
						name="correctAnswers"
						defaultValue={JSON.stringify(markCorrectAnswer)}
					/>
					<InputField
						type="url"
						placeholder="Link to codesandbox example"
						name="codesandboxExample"
						value={poll?.codeSandboxExample || ""}
					/>
					<>
						{action?.ok === false && <span>errors</span>}
						<>
							<TextAreaField
								placeholder="Insert code example (optional)"
								name="codeBlock"
								id="codeBlock"
								value={poll?.codeBlock || ""}
							/>
							<AddAnswerButton addField={addField} />

							{fields.map((field, index) => (
								<Fieldset
									key={field.id}
									title={`
								Answer ${index + 1}
								`}
								>
									<AnswerSettingsContainer
										addField={addField}
										field={field}
										fields={fields}
										setFields={setFields}
										markCorrectAnswer={markCorrectAnswer}
										setMarkCorrectAnswer={
											setMarkCorrectAnswer
										}
										mode={mode}
									/>
									{!field.explanation && (
										<AddExplanationFieldButton
											addField={addExplanationField}
											field={field}
										/>
									)}

									{field.explanation && (
										<ExplanationSettingsContainer
											field={field}
											fields={fields}
											setFields={setFields}
											mode={mode}
										/>
									)}
									<PointsInputField
										field={field}
										fields={fields}
										setFields={setFields}
									/>
								</Fieldset>
							))}
						</>
					</>

					{/* Required because more fields are needed (e.g blockType field), sd stringify. Reason: Don't want to lose Remix flexibility of forms. Should be checked on how to improve this.  */}
					<input
						type="hidden"
						name="answers"
						value={JSON.stringify(fields)}
					/>

					{!isAdmin && (
						<input
							type="hidden"
							name="sentInByUser"
							value={JSON.stringify({
								id: user?.firebase.id,
								displayName: user?.displayName,
							})}
						/>
					)}

					<section className="button-group">
						<Button
							type="button"
							variant="submit"
							onClick={() => {
								if (mode === "edit") setMode("mark");
								if (mode === "mark") setMode("edit");
							}}
						>
							{mode === "edit" ? "Mark answers" : "Done"}
						</Button>
					</section>

					<Button
						variant="submit"
						state={
							mode === "mark" || // can't submit when we are in "mark" mode
							markCorrectAnswer.length === 0 || // when the user didn't mark a correct answer
							pointsPerField === 0 // when the user didn't assign any points
								? "disabled"
								: undefined
						}
					>
						Submit
					</Button>
				</section>
				<PollSettingsContainer poll={poll} pollType={pollType} />
			</Form>
		</section>
	);
};

export default PollForm;
