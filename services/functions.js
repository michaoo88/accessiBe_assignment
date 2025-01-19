import { expect } from "@playwright/test";

//Login/Logout Functions
export async function loginUser(page, username, password) {
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();
}

//Cart Functions
export async function addItemToCart(page, itemId) {
  await page.locator(`[data-test="add-to-cart-${itemId}"]`).click();
}

export async function navigateToCart(page) {
  await page.locator(".shopping_cart_link").click();
}

//Checkout Functions
export async function fillCheckoutForm(page, firstName, lastName, postalCode) {
  await page.locator('[data-test="firstName"]').fill(firstName);
  await page.locator('[data-test="lastName"]').fill(lastName);
  await page.locator('[data-test="postalCode"]').fill(postalCode);
}

export async function submitCheckoutForm(page) {
  await page.locator('[data-test="continue"]').click();
}

export async function completeCheckout(page) {
  await page.locator('[data-test="finish"]').click();
}

export async function verifyCheckoutStep(page, step) {
  switch (step) {
    case "summary":
      await expect(page.locator(".checkout_summary_container")).toBeVisible();
      break;
    case "complete":
      await expect(page.locator(".complete-header")).toBeVisible();
      await expect(page.locator(".complete-header")).toHaveText(
        "Thank you for your order!"
      );
      break;
    case "cart":
      await expect(page.locator(".cart_list")).toBeVisible();
      break;
  }
}

//Default Test Data
export const defaultUserInfo = {
  firstName: "John",
  lastName: "Doe",
  postalCode: "12345",
};

export const testItems = {
  backpack: "sauce-labs-backpack",
  bikeLight: "sauce-labs-bike-light",
  boltTshirt: "sauce-labs-bolt-t-shirt",
  jacket: "sauce-labs-fleece-jacket",
  onesie: "sauce-labs-onesie",
  tshirt: "test.allthethings()-t-shirt",
};

module.exports = {
  loginUser,
  addItemToCart,
  navigateToCart,
  fillCheckoutForm,
  submitCheckoutForm,
  completeCheckout,
  verifyCheckoutStep,
  testItems,
  defaultUserInfo,
};
