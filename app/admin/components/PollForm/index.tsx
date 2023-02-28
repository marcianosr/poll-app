import { Form, useActionData } from "@remix-run/react";
import { v4 as uuidv4 } from "uuid";
import type { FC } from "react";
import { useEffect, useState } from "react";
import type { InputTypes, PollData, PollStatus } from "~/utils/polls";
import { useAuth } from "~/providers/AuthProvider";
import { CATEGORIES } from "~/utils/categories";
import { TextAreaField } from "../../../ui/TextAreaField";
import { InputField } from "../../../ui/InputField";
import { Text } from "../../../ui/Text";
import { Select } from "../../../ui/Select";
import { Button, links as buttonLinks } from "~/ui/Button";
import { AnswerSettingsContainer } from "../AnswersSettingsContainer";

export type BlockType = "text" | "code";
export type NewPollType = {
	id: string;
	type?: InputTypes;
	blockType?: BlockType;
	placeholder?: string;
	value?: string;
	autoFocus?: boolean;
};
export type CorrectAnswerType = {
	id: string;
	value: string;
};
export type Mode = "edit" | "mark";
export type Errors = {
	ok: boolean;
};
type Data =
	| ({ ok: boolean } & PollData)
	| { ok: boolean; errors: Errors }
	| undefined;
type Props = {
	poll?: PollData;
};

export function links() {
	return [];
}

const PollForm: FC<Props> = ({ poll }) => {
	const action: Data = useActionData();
	const { user, isAdmin } = useAuth();

	const [mode, setMode] = useState<Mode>("edit");
	const [pollStatus, setPollStatus] = useState<PollStatus>(
		(poll && poll?.status) || isAdmin ? "new" : "needs-revision"
	);

	const [fields, setFields] = useState<NewPollType[]>([
		{
			id: "eioozak-ojnab",
			type: "radio",
			blockType: "text",
			placeholder: "Add option",
			value: "",
			autoFocus: false,
		},
	]);

	const [markCorrectAnswer, setMarkCorrectAnswer] = useState<
		CorrectAnswerType[]
	>((poll && (poll?.correctAnswers as any)) || []);

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
			},
		]);
	};

	return (
		<section className="container">
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
								placeholder="Insert code example (not mandatory)"
								name="codeBlock"
								id="codeBlock"
								value={poll?.codeBlock || ""}
							/>
							<Button variant="secondary" onClick={addField}>
								Add new answer option
							</Button>
							{fields.map((field, index) => (
								<>
									<Text
										size="sm"
										variant="primary"
										tag="small"
									>
										Answer {index + 1}
									</Text>
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
								</>
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
						<button
							type="button"
							onClick={() => {
								if (mode === "edit") setMode("mark");
								if (mode === "mark") setMode("edit");
							}}
						>
							{mode === "edit" ? "Mark answers" : "Done"}
						</button>
					</section>

					<button
						type="submit"
						disabled={
							mode === "mark" || markCorrectAnswer.length === 0
						}
					>
						Submit
					</button>
				</section>{" "}
				<aside className="options">
					<div className="open-closed-toggle">
						<label htmlFor="status">
							{pollStatus !== "open"
								? "Not accepting responses"
								: "Accepting responses"}
						</label>

						{isAdmin ? (
							<select name="status" defaultValue={pollStatus}>
								<option value="open">open</option>
								<option value="closed">closed</option>
								<option value="needs-revision">
									needs revision
								</option>
								<option value="new">new</option>
							</select>
						) : (
							<select name="status" defaultValue={pollStatus}>
								<option value="needs-revision">
									needs revision
								</option>
							</select>
						)}
					</div>
					<select
						name="type"
						defaultValue={
							poll?.type === "radio" ? "radio" : "checkbox"
						}
					>
						<option value="radio">Single answer</option>
						<option value="checkbox">Multiple answers</option>
					</select>

					<select name="category" defaultValue={poll?.category}>
						{CATEGORIES.map((category) => (
							<option value={category}>{category}</option>
						))}
					</select>
				</aside>
			</Form>
		</section>
	);
};

export default PollForm;
