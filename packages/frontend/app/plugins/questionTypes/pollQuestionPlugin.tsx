import type { PollQuestionPlugin } from "@marcianosrs/engine";
import type { FormDataObject, TypedForm } from "@marcianosrs/form-schema";
import { Button } from "@marcianosrs/ui";
import React, { useState } from "react";

const answerSchema = [
	{
		fieldType: "text", // Markdown
		valueType: "string",
		displayName: "Add option",
		name: "answerOption",
		defaultValue: "",
		optional: false,
	},
	{
		fieldType: "text",
		valueType: "string",
		name: "explanation",
		displayName: "Explanation",
		optional: true,
		defaultValue: "",
	},
	{
		fieldType: "checkbox",
		valueType: "boolean",
		name: "correctAnswer",
		displayName: "Correct answer",
		defaultValue: false,
		optional: false,
	},
] as const satisfies TypedForm;

const pollQuestionForm = [
	{
		fieldType: "title",
		valueType: "none",
		name: "title",
		displayName: "Submit your poll question",
		optional: false,
		defaultValue: undefined,
	},
	{
		fieldType: "text",
		valueType: "string",
		displayName: "Question",
		name: "question",
		optional: false,
		defaultValue: "",
	},
	{
		fieldType: "text", // Markdown
		name: "description",
		valueType: "string",
		optional: true,
		displayName: "Extra description (markdown)",
		defaultValue: "",
	},
	{
		fieldType: "objectList",
		valueType: "objects",
		name: "answers",
		displayName: "Answers",
		objectSchema: answerSchema,
		optional: false,
		minimalAmount: 2,
	},
	{
		fieldType: "range",
		valueType: "number",
		name: "difficulty",
		displayName: "Difficulty",
		defaultValue: 0.5,
		min: 0,
		max: 10,
		optional: false,
		step: 1,
		labels: [
			{
				title: "Very easy",
				value: 1,
			},
			{
				title: "Easy",
				value: 2,
			},
			{
				title: "Medium",
				value: 3,
			},
			{
				title: "Hard",
				value: 4,
			},
			{
				title: "Master",
				value: 5,
			},
		],
	},
] as const satisfies TypedForm;

type PollQuestionData = typeof pollQuestionForm;

const isPollQuestionData = (
	e: unknown
): e is FormDataObject<PollQuestionData> => {
	if (typeof e !== "object" || e === null) return false;

	const pollQuestionFields = ["question", "answers", "difficulty"].every(
		(field) => field in e
	);

	return pollQuestionFields;
};

export const pollQuestion: PollQuestionPlugin<
	PollQuestionData,
	{ pickedAnswers: string[] }
> = {
	contentType: "pollQuestion",
	displayName: "Regular poll question",
	editForm: pollQuestionForm,
	ShowQuestion: ({ settings, onAnswer }) => {
		const [answersSelected, setAnswersSelected] = useState<string[]>([]);

		if (!isPollQuestionData(settings)) {
			return <div>Sorry the data of this poll question is not valid</div>;
		}

		return (
			<div>
				<h1>{settings.question}</h1>
				{settings.answers.map((a) => (
					<div key={a.answerOption}>
						<Button
							onClick={() => {
								setAnswersSelected((v) =>
									v.includes(a.answerOption)
										? v.filter((r) => r !== a.answerOption)
										: v.concat(a.answerOption)
								);
							}}
						>
							{answersSelected.includes(a.answerOption) && "✅"}{" "}
							{a.answerOption}
						</Button>
					</div>
				))}

				{onAnswer && (
					<Button
						onClick={() => {
							onAnswer?.(
								{ pickedAnswers: answersSelected },
								{
									rawPoints: 1,
									maxPointsAvailable: 2,
									answeredOrderNumber: 1,
									answeredOrderNumberCorrect: 1,
									questionDifficulty: settings.difficulty,
									timeTaken: 5_000,
									timeSinceQuestion: 30 * 60_000,
								}
							);
						}}
					>
						Submit result
					</Button>
				)}
			</div>
		);
	},
	getContentTitle: (data) => {
		if (!isPollQuestionData(data)) return "Error: No question data";
		return data.question;
	},
	// verifySettings: (e: unknown): e is PollQuestionData => false,
};
