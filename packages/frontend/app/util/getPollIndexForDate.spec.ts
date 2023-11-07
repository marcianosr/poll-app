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
		startedAt: createTimestamp("2023-10-13:10:00.000Z"),
		queue: ["poll-fri-13", "poll-mo-16", "poll-tu-17", "poll-wed-18"],
	});
	const today = new Date("2023-10-17T08:00:00.000Z"); // 4 days later, but contains a weekend

	const pollIndex = getPollIndexForDate(mockChannel, today);
	expect(pollIndex).toBe(2);
	expect(mockChannel.queue[pollIndex]).toEqual("poll-tu-17");
});

test("returns the last known index if date is too far in future", () => {
	const mockChannel = channelFactory({
		startedAt: createTimestamp("2023-10-13:10:00.000Z"),
		queue: ["poll-fri-13", "poll-mo-16", "poll-tu-17", "poll-wed-18"],
	});
	const today = new Date("2024-10-17T08:00:00.000Z");

	const pollIndex = getPollIndexForDate(mockChannel, today);
	expect(pollIndex).toBe(3);
	expect(mockChannel.queue[pollIndex]).toEqual("poll-wed-18");
});
