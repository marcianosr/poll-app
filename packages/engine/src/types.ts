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

export type PollDTO = {
	id: string;
	question: {
		type: string;
		data: { [x: string]: unknown };
	};
	createdAt: TimestampDTO;
	createdBy: string | null;
};
export type CreatePollDTO = Omit<PollDTO, "id" | "createdAt">;
export type UpdatePoll = Partial<PollDTO>;

export type ChannelCollection = {
	id: Pick<PollDTO, "id">;
	isOpen: boolean;
	userActions: ChannelCollectionUserAction[];
};

export type ChannelCollectionUserAction = {
	userId: string;
	action: {
		type: string;
		data: { [x: string]: unknown };
	};
};

export type ChannelDTO = {
	id: string;
	name: string;
	slug: string;
	theme: {
		type: string;
		data: { [x: string]: unknown };
	};
	createdAt: TimestampDTO;
	createdBy: string | null;
	frequency: {
		cronExpression: string;
		description: string;
	};
	collection: ChannelCollection[];
};

export type CreateChannelDTO = Omit<ChannelDTO, "id" | "createdAt" | "slug">;
export type UpdateChannel = Partial<ChannelDTO>;

// type PollPlugins =
// 	| "seasons"
// 	| "teams"
// 	| "christmas-2023"
// 	| "easter-2023"
// 	| "harry-potter"
// 	| "kabisino"
// 	| "double-points"
// 	| "1-vs-1";
