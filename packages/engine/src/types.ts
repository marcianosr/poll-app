// General types: might move to a shared central package

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

export const POLL_TYPES = [
	"single-choice",
	"multiple-choice",
	// "challenge",
	// "spot-the-bug",
] as const;

export type PollType = (typeof POLL_TYPES)[number];

export type PollOptionFormatting = "text" | "code";
export type PollTag = (typeof POLL_TAGS)[number];

export type PollOption = {
	id: string;
	value: string;
	isCorrect: boolean;
	formatting: PollOptionFormatting;
	explanation: string | null;
};

export type Poll = {
	id: string;
	question: string;
	options: PollOption[];
	type: PollType;
	no: number;
	tags: PollTag[];
	codeBlockExample: string | null;
	visualCodeExample: string | null;
	createdAt: number;
	createdBy: string | null;
};

export type CreatePoll = Poll;
