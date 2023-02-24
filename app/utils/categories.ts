export const CATEGORIES = [
	"html",
	"css",
	"general-frontend",
	"javascript",
	"react",
	"typescript",
	"git",
] as const;

export type PollCategory = typeof CATEGORIES[number];
