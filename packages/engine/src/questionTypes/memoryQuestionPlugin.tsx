import { FormDataObject, TypedForm } from "@marcianosrs/form-schema";
import { PollQuestionPlugin } from "../types/poll";
import React from "react";

const answerSchema = [
	{
		fieldType: "text",
		valueType: "string",
		displayName: "Card contents",
		name: "answerOption",
		defaultValue: "",
		optional: false,
	},
] as const satisfies TypedForm;

const memoryQuestionForm = [
	{
		fieldType: "title",
		valueType: "none",
		name: "title",
		displayName: "Submit your memory game",
		optional: false,
		defaultValue: undefined,
	},
	{
		fieldType: "objectList",
		valueType: "objects",
		name: "cards",
		displayName: "Cards",
		objectSchema: answerSchema,
		optional: false,
		minimalAmount: 2,
	},
] as const satisfies TypedForm;

type MemoryQuestionData = typeof memoryQuestionForm;

const isMemoryQuestionData = (
	e: unknown
): e is FormDataObject<MemoryQuestionData> => {
	if (typeof e !== "object" || e === null) return false;

	const data = e as FormDataObject<MemoryQuestionData>;

	return !!data.cards;
};

export const memoryQuestion: PollQuestionPlugin<
	MemoryQuestionData,
	{ pickedAnswers: string[] }
> = {
	contentType: "memoryQuestion",
	displayName: "Exciting memory game",
	editForm: memoryQuestionForm,
	ShowQuestion: () => (
		<div>
			<p>Hello World</p>
		</div>
	),
	getContentTitle: (data) => {
		if (!isMemoryQuestionData(data)) return "Error: No memory game data";
		// return data.cards;
	},
	// verifySettings: (e: unknown): e is PollQuestionData => false,
};
