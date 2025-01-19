import { test, expect } from "@playwright/test";
import { loginUser } from "../services/functions";
import dotenv from "dotenv";

dotenv.config();

test.describe("Navigation functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL);
    await loginUser(
      page,
      process.env.STANDARD_USER,
      process.env.STANDARD_PASSWORD
    );
    await expect(page.locator(".inventory_list")).toBeVisible();
  });

  const openMenu = async (page) => {
    await page.locator("#react-burger-menu-btn").click();
  };

  test("navigate to About page", async ({ page }) => {
    await openMenu(page);
    await page.locator('[data-test="about-sidebar-link"]').click();
    await expect(page).toHaveURL(/.*saucelabs\.com/);
  });

  test("navigate back to Inventory page", async ({ page }) => {
    await openMenu(page);
    await page.locator('[data-test="inventory-sidebar-link"]').click();
    await expect(page.locator(".inventory_list")).toBeVisible();
  });

  test("reset app state", async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page
      .locator('[data-test="add-to-cart-sauce-labs-bike-light"]')
      .click();
    await openMenu(page);
    await page.locator('[data-test="reset-sidebar-link"]').click();
    await expect(page.locator("#react-burger-menu-btn")).toBeVisible();
    await expect(page.locator(".shopping_cart_link")).not.toHaveClass(
      ".shopping_cart_badge"
    );
  });

  test("logout successfully", async ({ page }) => {
    await openMenu(page);
    await page.locator('[data-test="logout-sidebar-link"]').click();
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test("verify navigation menu accessibility from all item pages", async ({
    page,
  }) => {
    const itemLinks = [
      {
        selector: '[data-test="item-4-title-link"]',
        name: "Sauce Labs Backpack",
      },
      {
        selector: '[data-test="item-0-title-link"]',
        name: "Sauce Labs Bike Light",
      },
      {
        selector: '[data-test="item-1-title-link"]',
        name: "Sauce Labs Bolt T-Shirt",
      },
      {
        selector: '[data-test="item-5-title-link"]',
        name: "Sauce Labs Fleece Jacket",
      },
      {
        selector: '[data-test="item-2-title-link"]',
        name: "Sauce Labs Onesie",
      },
      {
        selector: '[data-test="item-3-title-link"]',
        name: "Test.allTheThings() T-Shirt",
      },
    ];

    for (const { selector, name } of itemLinks) {
      await test.step(`Verify navigation for ${name}`, async () => {
        await page.locator(selector).click();
        await expect(
          page.locator(".inventory_details_container")
        ).toBeVisible();
        await openMenu(page);
        await page.locator('[data-test="inventory-sidebar-link"]').click();
        await expect(page.locator(".inventory_container")).toBeVisible();
      });
    }
  });
});
