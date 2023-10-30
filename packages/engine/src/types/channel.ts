import { FirebaseBaseDTO } from "../types";
import type { ContentIdentifier } from "./identifiers";
import { rankingSystemStore } from "../rankingSystemStore";
import {
	FormDataObject,
	TypedForm,
	pluginField,
} from "@marcianosrs/form-schema";
import { themeStore } from "../themeStore";
import scoreProcessorStore from "../poll-results";

const rankingSystemSchema = [
	pluginField(
		"ranking",
		"Ranking system",
		rankingSystemStore,
		"rankingSystemType",
		"editForm"
	),
] as const satisfies TypedForm;

const scoreModifierSchema = [
	pluginField(
		"processor",
		"ScoreModifier",
		scoreProcessorStore,
		"processorType",
		"editForm"
	),
] as const satisfies TypedForm;

export const channelSchema = [
	{
		name: "name",
		valueType: "string",
		fieldType: "text",
		defaultValue: "",
		displayName: "name",
		optional: false,
	},
	pluginField("theme", "Theme", themeStore, "displayName", "editForm"),
	{
		name: "rankingSystems",
		displayName: "Ranking Systems",
		fieldType: "objectList",
		valueType: "objects",
		objectSchema: rankingSystemSchema,
		optional: false,
		minimalAmount: 1,
	},
	{
		name: "scoreModifiers",
		displayName: "ScoreModifiers",
		fieldType: "objectList",
		valueType: "objects",
		objectSchema: scoreModifierSchema,
		optional: true,
		minimalAmount: 0,
	},
] as const satisfies TypedForm;

export type ChannelDTO = FirebaseBaseDTO &
	FormDataObject<typeof channelSchema> & { slug: string };
export type CreateChannelDTO = Omit<ChannelDTO, "id" | "createdAt" | "slug">;
export type UpdateChannel = Partial<ChannelDTO>;

// export type Channel = {
//     id: ContentIdentifier;
//     name: string;
//     description: string;
//     owner: UserId;
//     theme: ContentIdentifier;
//     scoreSystems: ContentIdentifier[];
//     moderatorIds: string[];
//     createdAt: number;
//     createdBy: string;
//     playlist: PollItem[];
//     frequency: "daily" | "weekly";
//     order: "shuffle" | "asc" | "desc";
// };

// export type Season = {
//     id: ContentIdentifier;
//     name: string;
//     startDate: Date;
//     endDate: Date;
//     theme: ContentIdentifier;
//     scoreSystems: ContentIdentifier[];
// };

// export type ProductDefinition = {
//     id: ContentIdentifier;
//     channelId: ContentIdentifier;
//     seasonId?: ContentIdentifier;
//     name: string;
//     description: string;
//     // image?

//     theme?: ContentIdentifier;
//     scoreMutators?: ContentIdentifier[];
//     questionModifier?: ContentIdentifier[];

//     availableFrom?: Date;
//     availableTill?: Date;
//     availableAmount?: number;
// };

/**
 * TODO: Not sure if this is needed, but could be doing things like removing time limits,
 * setting time limits, halving time limits, etc.
 *
 * This is about ways to answer the question, the score is how to process the result
 */
export type QuestionModifier<T extends Record<string, unknown>> = {
	id: ContentIdentifier;
	name: string;
	internalMutatorId: string;

	config: T; // Settings like time-limit
};
