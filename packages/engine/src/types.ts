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

export type CreateAppChannel = Channel<AppChannel>;

export type PollStatus = "open" | "upcoming" | "closed";
type ChannelPlaylist = {
	pollId: string;
	status: PollStatus;
	openedAt: number | null;
};

export type Channel<P> = {
	id: string;
	name: string;
	slug: string;
	moderatorIds: string[];
	createdAt: number;
	createdBy: string | null;
	playlist: P[];
	distributionChannelName: DistributionChannelName;
};

type DistributionChannelName = "App" | "Slack" | "LinkedIn";

type AppChannelPlaylist = ChannelPlaylist & {
	votedBy: string[];
};

type AppChannel = Channel<AppChannelPlaylist> & {
	playerIds: string[];
	plugins: PollPlugins[];
};

type SlackChannel = Channel<ChannelPlaylist>;
type LinkedInChannel = Channel<ChannelPlaylist>;

export type ChannelTypeMap = {
	App: AppChannel;
	Slack: SlackChannel;
	LinkedIn: LinkedInChannel;
};

export type CreateChannelFn<K extends keyof ChannelTypeMap> = (
	key: K,
	channel: ChannelTypeMap[K]
) => ChannelTypeMap[K];

type PollPlugins =
	| "seasons"
	| "teams"
	| "christmas-2023"
	| "easter-2023"
	| "harry-potter"
	| "kabisino"
	| "double-points"
	| "1-vs-1";
