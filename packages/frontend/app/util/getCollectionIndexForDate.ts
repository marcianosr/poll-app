import type { CreateChannelDTO } from "@marcianosrs/engine";
import { parseCronExpression } from "cron-schedule";

export function getPollIndexForDate(
	channel: CreateChannelDTO,
	targetDate: Date
) {
	const cron = parseCronExpression(channel.frequency.cronExpression);
	const upcomingDates = cron.getNextDates(channel.collection.length);

	return upcomingDates.findIndex((d) => d.getTime() === targetDate.getTime());
}
