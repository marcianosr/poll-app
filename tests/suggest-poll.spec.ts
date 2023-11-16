import { test, expect } from "@playwright/test";

test("Suggest poll from the homepage", async ({ page }) => {
	await page.goto("/");
	await page.getByText("Suggest a poll").click();
	await page
		.getByRole("combobox", { name: "Question" })
		.selectOption("Regular poll question");

	const group = page.getByRole("group", { name: "Question Settings" });
	await group.getByLabel("Question").fill("What is the best test runner?");

	await group.getByText("Add Item").click();

	const answerItem1 = group.getByRole("group", { name: "Edit item" });
	await answerItem1.getByLabel("Add option").fill("Cypress");
	await answerItem1.getByText("Update item").click();

	await group.getByText("Add Item").click();

	const answerItem2 = group.getByRole("group", { name: "Edit item" });
	await answerItem2.getByLabel("Add option").fill("Playwright");
	await answerItem2.getByLabel("Correct answer").check();
	await answerItem2.getByText("Update item").click();

	await page.getByLabel("Difficulty").click();
	await page.keyboard.press("ArrowLeft");

	await page.getByRole("button", { name: "Ok" }).click();

	await expect(page).toHaveURL(/.*\/polls\/$/);
});
