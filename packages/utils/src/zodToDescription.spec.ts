import { test as it, expect } from "vitest";
import { z } from "zod";
import { zodToDescription } from "./zodToDescription";

it("can describe a never", () => {
	const result = zodToDescription(z.never());
	expect(result).toEqual("never");
});

it("can describe a string", () => {
	const result = zodToDescription(z.string());
	expect(result).toEqual("string");
});

it("can describe a number", () => {
	const result = zodToDescription(z.number());
	expect(result).toEqual("number");
});

it("can describe a union", () => {
	const result = zodToDescription(z.number().or(z.string()));
	expect(result).toEqual("number | string");
});

it("can describe a simple array", () => {
	const result = zodToDescription(z.number().array());
	expect(result).toEqual("number[]");
});

it("can describe an array", () => {
	const result = zodToDescription(z.number().or(z.string()).array());
	expect(result).toEqual("(number | string)[]");
});

it("can describe an empty object", () => {
	const result = zodToDescription(z.object({}));
	expect(result).toEqual("{}");
});

it("can describe an object with members", () => {
	const result = zodToDescription(
		z.object({ name: z.string(), age: z.number() })
	);
	expect(result).toEqual("{\n  name: string;\n  age: number;\n}");
});

it("can describe an object with optional members", () => {
	const result = zodToDescription(z.object({ name: z.string().optional() }));
	expect(result).toEqual("{\n  name?: string | undefined;\n}");
});
