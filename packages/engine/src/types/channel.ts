import { ContentIdentifier, UserId } from "./identifiers";
import { PollItem } from "./poll";

export type Channel = {
  id: ContentIdentifier;
  name: string;
  description: string;
  owner: UserId;
  theme: ContentIdentifier;
  scoreSystems: ContentIdentifier[];
  moderatorIds: string[];
	createdAt: number;
	createdBy: string;
	playlist: PollItem[];
	frequency: "daily" | "weekly";
	order: "shuffle" | "asc" | "desc";
};

export type Season = {
  id: ContentIdentifier;
  name: string;
  startDate: Date;
  endDate: Date;
  theme: ContentIdentifier;
  scoreSystems: ContentIdentifier[];
};

export type ProductDefinition = {
  id: ContentIdentifier;
  channelId: ContentIdentifier;
  seasonId?: ContentIdentifier;
  name: string;
  description: string;
  // image?

  theme?: ContentIdentifier;
  scoreMutators?: ContentIdentifier[];
  questionModifier?: ContentIdentifier[];

  availableFrom?: Date;
  availableTill?: Date;
  availableAmount?: number;
};

/**
 * Score mutator could:
 *
 * - Duplicate score
 * - Half the score
 * - Pick all wrong answers instead of right ones ? 'reverse' (how? can this be applied to all 'question types?')
 */
export type ScoreMutator<T extends Record<string, unknown>> = {
  id: ContentIdentifier;
  name: string;
  internalMutatorId: string;

  config: T; // Settings like 'multiplier value'
};

/**
 * TODO: Not sure if this is needed, but could be doing things like removing time limits,
 * setting time limits, halving time limits, etc. But maybe this should be merged with the score mutator?
 */
export type QuestionModifier<T extends Record<string, unknown>> = {
  id: ContentIdentifier;
  name: string;
  internalMutatorId: string;

  config: T; // Settings like 'multiplier value'
};
