import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { v4 as uuidv4 } from "uuid";
import { FC, Fragment, useEffect, useState } from "react";
import { InputTypes, PollData } from "~/utils/polls";
import DeleteButton from "../Button/DeleteButton";
import MarkButton from "../Button/MarkButton";

export type NewPollType = {
	id: string;
	type?: InputTypes;
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
	const [fields, setFields] = useState<NewPollType[]>([
		{
			id: "eioozak-ojnab",
			type: "radio",
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
				placeholder: `Add option`,
				value: "",
			},
		]);
	};

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

				<>
					{action?.ok === false && <span>errors</span>}

					<>
						{fields.map((field) => (
							<Fragment key={field.id}>
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
