import { test, expect } from "@playwright/test";
import { loginUser } from "../services/functions";
import dotenv from "dotenv";

dotenv.config();

test.describe("Login functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL);
  });

  test("login with correct credentials", async ({ page }) => {
    await loginUser(
      page,
      process.env.STANDARD_USER,
      process.env.STANDARD_PASSWORD
    );
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test("display error with incorrect password", async ({ page }) => {
    await loginUser(
      page,
      process.env.STANDARD_USER,
      process.env.INCORRECT_PASSWORD
    );
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(
      "Epic sadface: Username and password do not match"
    );
  });

  test("display error with incorrect username", async ({ page }) => {
    await loginUser(
      page,
      process.env.INCORRECT_USER,
      process.env.STANDARD_PASSWORD
    );
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(
      "Epic sadface: Username and password do not match"
    );
  });

  test("display error with empty username", async ({ page }) => {
    await loginUser(page, "", process.env.STANDARD_PASSWORD);
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(
      "Epic sadface: Username is required"
    );
  });

  test("display error with empty password", async ({ page }) => {
    await loginUser(page, process.env.STANDARD_USER, "");
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(
      "Epic sadface: Password is required"
    );
  });
});
