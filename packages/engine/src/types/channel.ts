import { ContentIdentifier, UserId } from "./identifiers";

export type Channel = {
  id: ContentIdentifier;
  name: string;
  description: string;
  owner: UserId;
  theme: ContentIdentifier;
  scoreSystems: ContentIdentifier[];
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
