import { TimestampDTO } from "../types";
import { ContentIdentifier } from "./identifiers";
import { PluginData } from "./plugin-data";
import { PollUserResult } from "./poll";

export type ChannelPollItemDTO = {
	id: ContentIdentifier;
	pollId: ContentIdentifier;
	channelId: ContentIdentifier;
	openedAt: TimestampDTO | null;
	closedAt: TimestampDTO | null;

	answers: PollUserResult<Record<string, unknown>>[];
	questionScorePluginsActive: PluginData[];
};

export type CreateChannelPollItemDTO = Omit<ChannelPollItemDTO, "id">;
