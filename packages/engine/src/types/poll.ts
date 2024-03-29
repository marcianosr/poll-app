import {
	type TypedForm,
	type FormDataObject,
	pluginField,
} from "@marcianosrs/form-schema";
import type { ContentIdentifier, UserId } from "./identifiers";
import type { QuestionScoreResult } from "./poll-result";
import { FirebaseBaseDTO } from "../types";
import { questionTypeStore } from "../questionTypeStore";
import React from "react";
import { PluginData } from "./plugin-data";

export const pollSchema = [
	pluginField(
		"question",
		"Question",
		questionTypeStore,
		"displayName",
		"editForm"
	),
] as const satisfies TypedForm;

export type PollDTO = FirebaseBaseDTO & FormDataObject<typeof pollSchema>;
export type CreatePollDTO = Omit<PollDTO, "id" | "createdAt">;
export type UpdatePoll = Partial<PollDTO>;

// export type QuestionFeedback = {
// 	questionId: ContentIdentifier;
// 	feedbackType: "confusing";
// 	details: string;
// 	resolved: boolean;
// };

// export type PollItem = {
// 	id: ContentIdentifier;
// 	channelId: ContentIdentifier;
// 	orderId: number;
// 	status: "closed" | "open" | "upcoming";
// 	questionId: ContentIdentifier;
// };

export type PollUserResult<AnswerData extends Record<string, unknown>> = {
	userId: UserId;
	questionResult: AnswerData;

	originalScoreResult: QuestionScoreResult;
	// After the scorePlugins have mutated the result
	processedScoreResult: QuestionScoreResult;
	userScorePluginsActive: PluginData[];
};

/**
 * Allows for different types of questions:
 *
 * Question type could be:
 *
 * - Poll with one / multiple correct answers
 * - Poll where chain of answers should be provided (like going to flow chart)
 * - Minigame
 * - Question about opinion where you can choose to already see what others voted or not (Tabs vs spaces!!!)
 */
export type PollQuestionPlugin<
	FormDefinition extends TypedForm,
	AnswerData extends Record<string, unknown>
> = {
	contentType: string;
	displayName: string;

	editForm: FormDefinition;

	createScoreResult: (
		question: FormDataObject<FormDefinition>,
		data: AnswerData,
		results: PollUserResult<AnswerData>[]
	) => QuestionScoreResult;

	ShowQuestion: React.FC<{
		settings: FormDataObject<FormDefinition>;
		mode: "preview" | "answer" | "result";
		currentUserId: string;
		pollUserResults?: PollUserResult<AnswerData>[];
		onAnswer?: (data: AnswerData) => void;
	}>;
	getContentTitle: (data: unknown) => string;
};
