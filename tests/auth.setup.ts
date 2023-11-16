import { test as setup, expect } from "@playwright/test";

const authFile = "tests/.auth/user.json";

setup("authenticate", async ({ page }) => {
	// Perform authentication steps. Replace these actions with your own.
	await page.goto("/test/auth");
	await page.getByRole("button", { name: "Login" }).click();
	await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

	// End of authentication steps.

	await page.context().storageState({ path: authFile });
});
