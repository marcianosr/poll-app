import { test as it, expect } from "vitest";
import { ScoreThresholdCutOff } from "./scoreThresholdCutOff";
import { createScoreResult } from "./questionResultFactory";

it("identifies as thresholdCutOff", () => {
	expect(ScoreThresholdCutOff.processorType).toEqual("thresholdCutOff");
});

it("cuts off scores below a threshold", () => {
	const scoreResult = createScoreResult({
		rawPoints: -10,
		maxPointsAvailable: 10,
	});

	const updatedResult = ScoreThresholdCutOff.processResult(scoreResult, {
		threshold: 0,
		overUnder: "under",
	});

	expect(updatedResult.maxPointsAvailable).toEqual(10);
	expect(updatedResult.rawPoints).toEqual(0);
});

it("cuts off scores above a threshold", () => {
	const scoreResult = createScoreResult({
		rawPoints: 10,
		maxPointsAvailable: 10,
	});

	const updatedResult = ScoreThresholdCutOff.processResult(scoreResult, {
		threshold: 7,
		overUnder: "over",
	});

	expect(updatedResult.maxPointsAvailable).toEqual(10);
	expect(updatedResult.rawPoints).toEqual(7);
});

it("leaves score under threshold alone", () => {
	const scoreResult = createScoreResult({
		rawPoints: 4,
		maxPointsAvailable: 10,
	});

	const updatedResult = ScoreThresholdCutOff.processResult(scoreResult, {
		threshold: 7,
		overUnder: "over",
	});

	expect(updatedResult.maxPointsAvailable).toEqual(10);
	expect(updatedResult.rawPoints).toEqual(4);
});

it("leaves score over threshold alone", () => {
	const scoreResult = createScoreResult({
		rawPoints: 4,
		maxPointsAvailable: 10,
	});

	const updatedResult = ScoreThresholdCutOff.processResult(scoreResult, {
		threshold: 0,
		overUnder: "under",
	});

	expect(updatedResult.maxPointsAvailable).toEqual(10);
	expect(updatedResult.rawPoints).toEqual(4);
});
