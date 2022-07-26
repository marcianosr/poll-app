import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { v4 as uuidv4 } from "uuid";
import { FC, Fragment, useRef, useState } from "react";
import { InputTypes, PollData } from "~/utils/polls";
import DeleteButton from "../Button/DeleteButton";
import MarkButton from "../Button/MarkButton";

export type NewPollType = {
	id: string;
	type: InputTypes;
	placeholder: string;
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

	const inputRef = useRef<HTMLInputElement>(null);
	const [mode, setMode] = useState<Mode>("edit");
	const [fields, setFields] = useState<NewPollType[]>([
		// poll && (poll.answers[0] as any),
		{
			id: uuidv4(),
			type: "radio",
			placeholder: "Add option",
		},
	]);
	const [answers, setAnswers] = useState(poll?.answers || []);

	const [markCorrectAnswer, setMarkCorrectAnswer] = useState<
		CorrectAnswerType[]
	>((poll?.correctAnswers as any) || []);

	console.log(markCorrectAnswer, answers);

	const addField = () => {
		setFields([
			...fields,
			{
				id: uuidv4(),
				type: "radio",
				placeholder: `Add option`,
			},
		]);
	};

	return (
		<>
			{answers.map((answer) => (
				<Fragment key={answer.id}>
					<input type="text" defaultValue={answer.value} />
					<button
						id={answer.id}
						onClick={(e) =>
							answers.filter((answer) => {
								setAnswers([
									...answers.filter(
										(a) => a.id !== e.currentTarget.id
									),
								]);
							})
						}
					>
						X
					</button>
				</Fragment>
			))}
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

				<>
					{action?.ok === false && <span>errors</span>}

					<>
						{fields.map((field, idx) => (
							<Fragment key={field.id}>
								<input
									type="text"
									className={
										markCorrectAnswer.find(
											(item) => item.id === field.id
										) && "correct"
									}
									ref={inputRef}
									placeholder={field.placeholder}
									disabled={mode === "mark"}
									name={`answer-${idx}`}
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
										inputRef={inputRef}
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

				<select name="type">
					<option value="radio">radio</option>
					<option value="checkbox">checkbox</option>
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
