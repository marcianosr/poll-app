import { expect, test } from "vitest";
import { getPollIndexForDate } from "./getPollIndexForDate";
import { channelFactory } from "./channelFactory";
import { createTimestamp } from "./factory";

test("returns -1 if the channel is not started", () => {
	const mockChannel = channelFactory({ startedAt: null });
	const futureDate = new Date("2023-12-31T09:00:00.000Z");

	const pollIndex = getPollIndexForDate(mockChannel, futureDate);
	expect(pollIndex).toBe(-1);
});

test("returns -1 if the channel has no frequency", () => {
	const mockChannel = channelFactory({ frequency: undefined });
	const futureDate = new Date("2023-12-31T09:00:00.000Z");

	const pollIndex = getPollIndexForDate(mockChannel, futureDate);
	expect(pollIndex).toBe(-1);
});

test("returns the index for the question active today", () => {
	const mockChannel = channelFactory({
		startedAt: createTimestamp("2023-11-10:10:00.000Z"),
		queue: ["poll-fri-10", "poll-mo-13", "poll-tu-14", "poll-wed-15"],
	});
	const today = new Date("2023-11-15T08:00:00.000Z"); // 4 days later, but contains a weekend

	const pollIndex = getPollIndexForDate(mockChannel, today);
	expect(pollIndex).toBe(2);
	expect(mockChannel.queue[pollIndex]).toEqual("poll-tu-14");
});

test("returns the last known index if date is too far in future", () => {
	const mockChannel = channelFactory({
		startedAt: createTimestamp("2023-11-10:10:00.000Z"),
		queue: ["poll-fri-10", "poll-mo-13", "poll-tu-14", "poll-wed-15"],
	});
	const today = new Date("2024-10-15T08:00:00.000Z");

	const pollIndex = getPollIndexForDate(mockChannel, today);
	expect(pollIndex).toBe(3);
	expect(mockChannel.queue[pollIndex]).toEqual("poll-wed-15");
});
