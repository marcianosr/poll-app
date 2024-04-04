import type { PollData } from "./polls";

// Remove this in favour of getAllUniqueCategories
export const CATEGORIES = [
	"html",
	"css",
	"general-frontend",
	"javascript",
	"react",
	"typescript",
	"git",
	"next",
] as const;

export type PollCategory = typeof CATEGORIES[number];

export const getAllUniqueCategories = (polls: PollData[]) => {
	const categories = polls.map((poll) => poll.category);
	return [...new Set(categories)];
};
