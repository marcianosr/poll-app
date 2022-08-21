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
	const [blockType, setBlockType] = useState<BlockType>("text");
	const [pollStatus, setPollStatus] = useState<PollStatus>(
		(poll && poll?.status) || "closed"
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

	console.log(fields);

	const updateBlockTypeByField = (id: string) => {
		console.log("id", id);
		console.log("block", blockType);
	};

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

	const updatePollStatus = () =>
		pollStatus === "open" ? setPollStatus("closed") : setPollStatus("open");

	return (
		<>
			<Form method="post">
				<input
					type="text"
					placeholder="question"
					name="question"
					defaultValue={poll?.question}
				/>

				<input
					type="hidden"
					name="correctAnswers"
					defaultValue={JSON.stringify(markCorrectAnswer)}
				/>

				<label htmlFor="status">
					{pollStatus === "closed"
						? "Not accepting responses"
						: "Accepting responses"}
				</label>
				<input
					type="checkbox"
					name="status"
					value={pollStatus}
					defaultChecked={pollStatus === "open"}
					onClick={updatePollStatus}
					id="status"
				/>
				{pollStatus === "closed" ? (
					<input type="hidden" value="closed" name="status" />
				) : (
					<input
						type="hidden"
						name="status"
						value="open"
						onClick={updatePollStatus}
						id="status"
					/>
				)}

				<>
					{action?.ok === false && <span>errors</span>}
					<>
						{fields.map((field) => (
							<Fragment key={field.id}>
								{field.blockType === "text" ? (
									<input
										type="text"
										className={
											markCorrectAnswer.find(
												(item) => item.id === field.id
											) && "correct"
										}
										placeholder={field.placeholder}
										disabled={mode === "mark"}
										name={`answer-${field.id}`}
										id={field.id}
										value={field.value}
										onChange={(e: React.ChangeEvent) => {
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
												(item) => item.id === field.id
											) && "correct"
										}
										placeholder={field.placeholder}
										disabled={mode === "mark"}
										name={`answer-${field.id}`}
										id={field.id}
										value={field.value}
										onChange={(e: React.ChangeEvent) => {
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
																	prev[idx]
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
										markCorrectAnswer={markCorrectAnswer}
										setMarkCorrectAnswer={
											setMarkCorrectAnswer
										}
										field={field}
									/>
								)}
							</Fragment>
						))}
					</>
				</>

				{/* Required because more fields are needed (e.g blockType field), sd stringify. Reason: Don't want to lose Remix flexibility of forms. Should be checked on how to improve this.  */}
				<input
					type="hidden"
					name="answers"
					value={JSON.stringify(fields)}
				/>

				<select
					name="type"
					defaultValue={poll?.type === "radio" ? "radio" : "checkbox"}
				>
					<option value="radio">Single answer</option>
					<option value="checkbox">Multiple answers</option>
				</select>

				<button
					type="submit"
					disabled={mode === "mark" || markCorrectAnswer.length === 0}
				>
					Submit
				</button>
			</Form>

			<button
				onClick={() => {
					if (mode === "edit") setMode("mark");
					if (mode === "mark") setMode("edit");
				}}
			>
				{mode === "edit" ? "Mark answers" : "Done"}
			</button>
			<button onClick={addField}>Toevoegen</button>
		</>
	);
};

export default PollForm;
