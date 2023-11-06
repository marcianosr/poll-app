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
		defaultValue: 3,
		min: 1,
		max: 5,
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

const MAX_POINTS_MAX_DIFFICULTY = 3; // will be 3 * 5 = 15

export const pollQuestion: PollQuestionPlugin<
	PollQuestionData,
	{ pickedAnswers: string[] }
> = {
	contentType: "pollQuestion",
	displayName: "Regular poll question",
	editForm: pollQuestionForm,
	createScoreResult: (question, data, results) => {
		// TODO: This function should be thoroughly unit tested.

		const amountCorrectAnswers = question.answers.filter(
			(a) => a.correctAnswer
		).length;
		const amountCorrect = question.answers.filter(
			(answer) =>
				answer.correctAnswer &&
				data.pickedAnswers.includes(answer.answerOption)
		).length;

		const amountCorrectResults = results.filter(
			(f) =>
				f.originalScoreResult.rawPoints ===
				f.originalScoreResult.maxPointsAvailable
		).length;

		const maxPointsAvailable =
			question.difficulty * MAX_POINTS_MAX_DIFFICULTY;

		const perfectAnswer =
			amountCorrectAnswers === amountCorrect &&
			amountCorrect === data.pickedAnswers.length;

		const pointsPerWrongAnswer =
			maxPointsAvailable / question.answers.length;

		const rawPoints = perfectAnswer
			? maxPointsAvailable
			: (amountCorrect / amountCorrectAnswers) * maxPointsAvailable -
			  (data.pickedAnswers.length - amountCorrect) *
					pointsPerWrongAnswer;

		return {
			answeredOrderNumber: results.length,
			answeredOrderNumberCorrect: perfectAnswer
				? amountCorrectResults
				: null,
			maxPointsAvailable,
			rawPoints,
			questionDifficulty: question.difficulty,
			timeSinceQuestion: 0, // will be implemented later
			timeTaken: 0, // will be implemented later
		};
	},
	ShowQuestion: ({
		settings,
		onAnswer,
		mode,
		pollUserResults = [],
		currentUserId,
	}) => {
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
								onAnswer &&
									setAnswersSelected((v) =>
										v.includes(a.answerOption)
											? v.filter(
													(r) => r !== a.answerOption
											  )
											: v.concat(a.answerOption)
									);
							}}
						>
							{answersSelected.includes(a.answerOption) && "✅"}{" "}
							{a.answerOption}
						</Button>
						{mode === "result" && a.correctAnswer ? "✅" : "🚫"}
						{mode === "result" &&
							pollUserResults.some(
								(r) =>
									r.questionResult.pickedAnswers.includes(
										a.answerOption
									) && r.userId === currentUserId
							) &&
							"You!"}
					</div>
				))}

				{onAnswer && (
					<Button
						onClick={() => {
							onAnswer?.({ pickedAnswers: answersSelected });
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
