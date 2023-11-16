import { test as it, expect } from "vitest";
import { ScoreMultiplier } from "./scoreMultiplier";
import { createScoreResult } from "./questionResultFactory";

it("identifies as multiplier", () => {
	expect(ScoreMultiplier.processorType).toEqual("multiplier");
});

it("can multiply scores", () => {
	const originalScoreResult = createScoreResult({
		rawPoints: 5,
		maxPointsAvailable: 5,
	});
	const result = ScoreMultiplier.processResult(originalScoreResult, {
		multiplier: 2,
	});
	expect(result.rawPoints).toEqual(10);
	expect(result.maxPointsAvailable).toEqual(10);
});
