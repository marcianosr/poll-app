// General types: might move to a shared central package

import { ContentIdentifier } from "./types/identifiers";

export const POLL_TAGS = [
	"javascript",
	"typescript",
	"react",
	"a11y",
	"css",
	"html",
	"git",
	"general-frontend",
	"general-backend",
	"flutter",
] as const;

// Left for inspiration
export const POLL_TYPES = [
	"single-choice",
	"multiple-choice",
	// "challenge",
	// "spot-the-bug",
] as const;

export type TimestampDTO = {
	_seconds: number;
	_nanoseconds: number;
};

export type FirebaseBaseDTO = {
	id: ContentIdentifier;
	createdAt: TimestampDTO;
	createdBy: string | null;
};

// type PollPlugins =
// 	| "seasons"
// 	| "teams"
// 	| "christmas-2023"
// 	| "easter-2023"
// 	| "harry-potter"
// 	| "kabisino"
// 	| "double-points"
// 	| "1-vs-1";
