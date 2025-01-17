import { test, expect } from "@playwright/test";
import { loginUser } from "../services/functions";

test.describe("Navigation functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    await loginUser(page, "standard_user", "secret_sauce");
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test("should navigate to About page", async ({ page }) => {
    await page.getByRole("button", { name: "Open Menu" }).click();
    await page.locator('[data-test="about-sidebar-link"]').click();
    await expect(page).toHaveURL("https://saucelabs.com/");
  });

  test("should navigate back to Inventory page", async ({ page }) => {
    await page.getByRole("button", { name: "Open Menu" }).click();
    await page.locator('[data-test="inventory-sidebar-link"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test("should reset app state", async ({ page }) => {
    await page.getByRole("button", { name: "Open Menu" }).click();
    await page.locator('[data-test="reset-sidebar-link"]').click();
    await expect(page).toHaveURL("https://www.saucedemo.com/");
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test("should logout successfully", async ({ page }) => {
    await page.getByRole("button", { name: "Open Menu" }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    await expect(page).toHaveURL("https://www.saucedemo.com/");
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test("Navigation bar accessible from all pages", async ({ page }) => {
    const itemLinks = [
      '[data-test="item-4-title-link"]',
      '[data-test="item-0-title-link"]',
      '[data-test="item-1-title-link"]',
      '[data-test="item-5-title-link"]',
      '[data-test="item-2-title-link"]',
      '[data-test="item-3-title-link"]',
    ];

    for (const link of itemLinks) {
      await page.locator(link).click();
      await page.getByRole("button", { name: "Open Menu" }).click();
      await page.locator('[data-test="inventory-sidebar-link"]').click();
    }
  });
});
