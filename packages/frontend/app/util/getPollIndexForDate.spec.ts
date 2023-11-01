import { afterAll, beforeAll, expect, test, vitest } from "vitest";
import type { CreateChannelDTO } from "@marcianosrs/engine";
import { getPollIndexForDate } from "./getPollIndexForDate";

export const mockChannel: CreateChannelDTO = {
	name: "Test Channel",
	theme: {
		type: "default",
		data: {},
	},
	createdBy: "user-id",
	frequency: {
		cronExpression: "0 10 * * 1-5",
		description: "Every weekday around 10 'o' clock",
	},
	collection: [
		{
			pollId: "poll-1",
			isOpen: false,
			result: {
				question: {
					type: "pollQuestion",
					data: {
						question: "What is React?",
						description: undefined,
						answers: [Array],
						difficulty: 5,
					},
				},
			},
		},
		{
			pollId: "poll-2",
			isOpen: false,
			result: {
				question: {
					type: "pollQuestion",
					data: {
						question: "What is React?",
						description: undefined,
						answers: [Array],
						difficulty: 5,
					},
				},
			},
		},
		{
			pollId: "poll-3",
			isOpen: false,
			result: {
				question: {
					type: "pollQuestion",
					data: {
						question: "What is React?",
						description: undefined,
						answers: [Array],
						difficulty: 5,
					},
				},
			},
		},
	],
};

const mockUpcomingDates = [
	new Date("2023-10-25T09:00:00.000Z"),
	new Date("2023-10-26T09:00:00.000Z"),
	new Date("2023-10-27T09:00:00.000Z"),
	new Date("2023-10-30T09:00:00.000Z"),
	new Date("2023-10-31T09:00:00.000Z"),
	new Date("2023-11-01T09:00:00.000Z"),
	new Date("2023-11-02T09:00:00.000Z"),
];

vitest.mock("cron-schedule", () => {
	return {
		parseCronExpression: vitest.fn(() => {
			return {
				getNextDates: vitest.fn().mockReturnValue(mockUpcomingDates),
			};
		}),
	};
});

beforeAll(() => {
	vitest.useFakeTimers();
});

afterAll(() => {
	vitest.useRealTimers();
});

test("returns -1 if the date is not in the upcoming dates", () => {
	const futureDate = new Date("2023-12-31T09:00:00.000Z");

	const pollIndex = getPollIndexForDate(mockChannel, futureDate);

	expect(pollIndex).toBe(-1);
});

test("returns the correct collection index for the current date", () => {
	const currentDate = new Date("2023-10-25T09:00:00.000Z");

	const pollIndex = getPollIndexForDate(mockChannel, currentDate);

	expect(pollIndex).toBe(0);
	expect(mockChannel.collection[pollIndex].pollId).toBe("poll-1");
});

test("returns the correct collection index for the current date", () => {
	const currentDate = new Date("2023-10-27T09:00:00.000Z");

	const pollIndex = getPollIndexForDate(mockChannel, currentDate);

	expect(pollIndex).toBe(2);
	expect(mockChannel.collection[pollIndex].pollId).toBe("poll-3");
});
