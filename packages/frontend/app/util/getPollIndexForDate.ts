import type { ChannelDTO } from "@marcianosrs/engine";
import { parseCronExpression } from "cron-schedule";

export function getPollIndexForDate(channel: ChannelDTO, targetDate: Date) {
	if (channel.frequency === undefined || channel.startedAt === null) {
		return -1;
	}
	const cron = parseCronExpression(channel.frequency);
	let currentDate = new Date(channel.startedAt._seconds);
	let index = 0;
	while (index < channel.playlist.length - 1) {
		const nextDate = cron.getNextDate(currentDate);
		if (nextDate.getTime() > targetDate.getTime()) {
			break;
		}
		index++;
		currentDate = nextDate;
	}
	return index;
}
