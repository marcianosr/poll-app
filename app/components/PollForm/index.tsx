import { Form, useActionData } from "@remix-run/react";
import { v4 as uuidv4 } from "uuid";
import React, { FC, Fragment, useCallback, useEffect, useState } from "react";
import { InputTypes, PollData, PollStatus } from "~/utils/polls";
import DeleteButton from "../Button/DeleteButton";
import MarkButton from "../Button/MarkButton";

export type BlockType = "text" | "code";
export type NewPollType = {
	id: string;
	type?: InputTypes;
	blockType?: BlockType;
	placeholder?: string;
	value?: string;
};
export type CorrectAnswerType = {
	id: string;
	value: string;
};
type Mode = "edit" | "mark";
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
const PollForm: FC<Props> = ({ poll }) => {
	const action: Data = useActionData();

	const [mode, setMode] = useState<Mode>("edit");
	const [pollStatus, setPollStatus] = useState<PollStatus>(
		(poll && poll?.status) || "new"
	);

	const [fields, setFields] = useState<NewPollType[]>([
		{
			id: "eioozak-ojnab",
			type: "radio",
			blockType: "text",
			placeholder: "Add option",
			value: "",
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
			...fields,
			{
				id: uuidv4(),
				type: "radio",
				blockType: "text",
				placeholder: `Add option`,
				value: "",
			},
		]);
	};

	const onCMDAndEnterPressed = (e: React.KeyboardEvent) => {
		if (e.metaKey && e.key === "Enter") addField();
	};

	const updatePollStatus = () =>
		pollStatus === "open" ? setPollStatus("closed") : setPollStatus("open");

	return (
		<section className="container">
			<Form method="post" className="form">
				<section className="questions-and-answers">
					<input
						type="text"
						placeholder="Question"
						name="question"
						defaultValue={poll?.question}
						className="question"
					/>

					<input
						type="hidden"
						name="correctAnswers"
						defaultValue={JSON.stringify(markCorrectAnswer)}
					/>

					<>
						{action?.ok === false && <span>errors</span>}
						<>
							<textarea
								placeholder="Insert code example"
								name="codeBlock"
								id="codeBlock"
								defaultValue={poll?.codeBlock}
							></textarea>
							{fields.map((field) => (
								<section
									className="answer-container"
									key={field.id}
								>
									{field.blockType === "text" ? (
										<input
											type="text"
											className={
												markCorrectAnswer.find(
													(item) =>
														item.id === field.id
												) && "correct"
											}
											placeholder={field.placeholder}
											disabled={mode === "mark"}
											name={`answer-${field.id}`}
											id={field.id}
											value={field.value}
											onKeyDown={(e) =>
												onCMDAndEnterPressed(e)
											}
											onChange={(
												e: React.ChangeEvent
											) => {
												setFields([
													...fields.map((f) =>
														f.id === field.id
															? {
																	...f,
																	value: (
																		e.target as HTMLInputElement
																	).value,
															  }
															: f
													),
												]);
											}}
										/>
									) : (
										<textarea
											className={
												markCorrectAnswer.find(
													(item) =>
														item.id === field.id
												) && "correct"
											}
											placeholder={field.placeholder}
											disabled={mode === "mark"}
											name={`answer-${field.id}`}
											id={field.id}
											value={field.value}
											onKeyDown={(e) =>
												onCMDAndEnterPressed(e)
											}
											onChange={(
												e: React.ChangeEvent
											) => {
												setFields([
													...fields.map((f) =>
														f.id === field.id
															? {
																	...f,
																	value: (
																		e.target as HTMLInputElement
																	).value,
															  }
															: f
													),
												]);
											}}
										></textarea>
									)}
									<button
										onClick={(e: React.MouseEvent) => {
											e.preventDefault();

											return setFields((prev) => {
												console.log("pre", prev);

												return [
													...fields.map((f, idx) =>
														f.id === field.id
															? {
																	...f,
																	blockType:
																		prev[
																			idx
																		]
																			.blockType ===
																		"text"
																			? "code"
																			: ("text" as any),
															  }
															: f
													),
												];
											});
										}}
									>
										Toggle {field.blockType}
									</button>

									{fields.length > 1 && mode === "edit" && (
										<DeleteButton
											fieldId={field.id}
											fields={fields}
											setFields={setFields}
										/>
									)}

									{mode === "mark" && (
										<MarkButton
											markCorrectAnswer={
												markCorrectAnswer
											}
											setMarkCorrectAnswer={
												setMarkCorrectAnswer
											}
											field={field}
										/>
									)}
								</section>
							))}
						</>
					</>

					{/* Required because more fields are needed (e.g blockType field), sd stringify. Reason: Don't want to lose Remix flexibility of forms. Should be checked on how to improve this.  */}
					<input
						type="hidden"
						name="answers"
						value={JSON.stringify(fields)}
					/>

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
						<select name="status" defaultValue={pollStatus}>
							<option value="open">open</option>
							<option value="closed">closed</option>
							<option value="needs-revision">
								needs revision
							</option>
							<option value="new">new</option>
						</select>
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
						<option value="html">HTML</option>
						<option value="css">CSS</option>
						<option value="javascript">JavaScript</option>
						<option value="typescript">TypeScript</option>
						<option value="general-frontend">
							General frontend
						</option>
						<option value="react">React</option>
					</select>
				</aside>
			</Form>
			<section className="button-group">
				<button
					onClick={() => {
						if (mode === "edit") setMode("mark");
						if (mode === "mark") setMode("edit");
					}}
				>
					{mode === "edit" ? "Mark answers" : "Done"}
				</button>
			</section>
		</section>
	);
};

export default PollForm;
