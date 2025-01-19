import { test, expect } from "@playwright/test";
import {
  loginUser,
  addItemToCart,
  navigateToCart,
  fillCheckoutForm,
  submitCheckoutForm,
  completeCheckout,
  verifyCheckoutStep,
  testItems,
  defaultUserInfo,
} from "../services/functions";
import dotenv from "dotenv";

dotenv.config();

test.describe("Form validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL);
    await loginUser(
      page,
      process.env.STANDARD_USER,
      process.env.STANDARD_PASSWORD
    );
    await expect(page.locator(".inventory_list")).toBeVisible();
    await addItemToCart(page, testItems.backpack);
    await navigateToCart(page);
    await page.locator('[data-test="checkout"]').click();
  });

  test("complete checkout with valid information", async ({ page }) => {
    await fillCheckoutForm(
      page,
      defaultUserInfo.firstName,
      defaultUserInfo.lastName,
      defaultUserInfo.postalCode
    );
    await submitCheckoutForm(page);
    await verifyCheckoutStep(page, "summary");
    await completeCheckout(page);
    await verifyCheckoutStep(page, "complete");
  });

  test("show error for empty first name", async ({ page }) => {
    await fillCheckoutForm(
      page,
      "",
      defaultUserInfo.lastName,
      defaultUserInfo.postalCode
    );
    await submitCheckoutForm(page);

    await expect(page.locator('[data-test="error"]')).toHaveText(
      "Error: First Name is required"
    );
  });

  test("show error for empty last name", async ({ page }) => {
    await fillCheckoutForm(
      page,
      defaultUserInfo.firstName,
      "",
      defaultUserInfo.postalCode
    );
    await submitCheckoutForm(page);

    await expect(page.locator('[data-test="error"]')).toHaveText(
      "Error: Last Name is required"
    );
  });

  test("show error for empty postal code", async ({ page }) => {
    await fillCheckoutForm(
      page,
      defaultUserInfo.firstName,
      defaultUserInfo.lastName,
      ""
    );
    await submitCheckoutForm(page);

    await expect(page.locator('[data-test="error"]')).toHaveText(
      "Error: Postal Code is required"
    );
  });

  test("validate input field lengths", async ({ page }) => {
    const longString = "a".repeat(257);
    await page.locator('[data-test="firstName"]').fill(longString);
    await page.locator('[data-test="lastName"]').fill(longString);
    await page.locator('[data-test="postalCode"]').fill(longString);
    await page.locator('[data-test="continue"]').click();

    // No max length restriction..
    await expect(page.locator(".checkout_summary_container")).toBeVisible();
  });

  test("handle special characters in input fields", async ({ page }) => {
    await page.locator('[data-test="firstName"]').fill("John@#$");
    await page.locator('[data-test="lastName"]').fill("Doe!@#");
    await page.locator('[data-test="postalCode"]').fill("123-45");
    await page.locator('[data-test="continue"]').click();

    // No special characters restrictions
    await expect(page.locator(".checkout_summary_container")).toBeVisible();
  });

  test("preserve cart items when canceling checkout", async ({ page }) => {
    await page.locator('[data-test="cancel"]').click();
    await expect(page.locator(".cart_item")).toBeVisible();
    
    await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
  });
});
