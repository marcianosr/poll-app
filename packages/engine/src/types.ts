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
export type UpdatePoll = Partial<Poll>;

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
