import { test, expect } from "@playwright/test";

test("is authenticated", async ({ page }) => {
	await page.goto("/");

	await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle(/New Remix App/);
});
