import { TimestampDTO } from "../types";
import { ContentIdentifier } from "./identifiers";
import { PollUserResult } from "./poll";

export type ChannelPollItemDTO = {
	pollId: ContentIdentifier;
	channelId: ContentIdentifier;
	openedAt: TimestampDTO | null;
	closedAt: TimestampDTO | null;
	answers: PollUserResult<Record<string, unknown>>[];
};
