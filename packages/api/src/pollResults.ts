import { ContentIdentifier, PollUserResult } from "@marcianosrs/engine";
import { CHANNEL_POLLS } from "./collection-consts";
import { FieldValue, db } from "./firebase";

export const createPollResult = async (
	channelPollId: ContentIdentifier,
	answer: PollUserResult<Record<string, unknown>>
): Promise<void> => {
	await db
		.collection(CHANNEL_POLLS)
		.doc(channelPollId)
		.update({ answers: FieldValue.arrayUnion(answer) });
};
