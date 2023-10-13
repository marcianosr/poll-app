import { TypedForm } from "@marcianosrs/form-schema";
import { PollQuestionPlugin } from "../types/poll";
import React from "react";

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
        fieldType: "number",
        valueType: "number",
        name: "difficulty",
        displayName: "Difficulty",
        defaultValue: 0.5,
        min: 0.0,
        max: 1.0,
        optional: false,
    },
] as const satisfies TypedForm;

type PollQuestionData = typeof pollQuestionForm;

export const pollQuestion: PollQuestionPlugin<
    PollQuestionData,
    { pickedAnswers: string[] }
> = {
    contentType: "pollQuestion",
    editForm: pollQuestionForm,
    ShowQuestion: () => (
        <div>
            <p>Hello World</p>
        </div>
    ),
    // verifySettings: (e: unknown): e is PollQuestionData => false,
};
