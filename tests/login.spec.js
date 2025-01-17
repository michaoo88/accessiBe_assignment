import { test, expect } from "@playwright/test";
import { loginUser } from "../services/functions";

test.describe("Login functionality", () => {
  // Setup that runs before each test
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
  });

  test("should login successfully with correct credentials", async ({
    page,
  }) => {
    await loginUser(page, "standard_user", "secret_sauce");
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test("should show error with incorrect password", async ({ page }) => {
    await loginUser(page, "standard_user", "incorrect_password");
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(
      "Epic sadface: Username and password do not match"
    );
  });

  test("should show error with incorrect username", async ({ page }) => {
    await loginUser(page, "incorrect_userName", "secret_sauce");
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(
      "Epic sadface: Username and password do not match"
    );
  });
});
