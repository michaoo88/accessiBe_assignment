import { test, expect } from "@playwright/test";
import { cartMocks } from "../services/cart.mocks";

test.describe("Shopping Cart API Routing", () => {
    test.beforeEach(async ({ page }) => {
    await page.goto("https://demo-opencart.com/");
    await page.waitForLoadState("networkidle");
  });

  // Helper functions
  const getCartButton = (page) => page.locator(cartMocks.selectors.cartButton);
  const getAddToCartButton = (page) =>
    page.locator(cartMocks.selectors.addToCartButton).first();
  const getErrorAlert = (page) => page.locator(cartMocks.selectors.errorAlert);

  // Helper function to create response with proper JSON stringification
  const createResponse = (mockResponse) => ({
    status: mockResponse.status,
    contentType: mockResponse.contentType,
    body:
      mockResponse.contentType === "application/json"
        ? JSON.stringify(mockResponse.body)
        : mockResponse.body,
  });

  test("should successfully add product to cart", async ({ page }) => {
    let addToCartReceived = false;
    let cartInfoReceived = false;

    // Mock add to cart request
    await page.route(cartMocks.endpoints.addToCart, async (route) => {
      addToCartReceived = true;
      await route.fulfill(createResponse(cartMocks.addToCartResponses.success));
    });

    // Mock the cart info request
    await page.route(cartMocks.endpoints.cartInfo, async (route) => {
      cartInfoReceived = true;
      await route.fulfill(createResponse(cartMocks.cartInfoResponses.oneItem));
    });

    // Add product to cart
    const addToCartButton = getAddToCartButton(page);
    await addToCartButton.waitFor({ state: "visible" });
    await addToCartButton.click();

    // Wait for both requests to complete
    await expect
      .poll(() => addToCartReceived && cartInfoReceived, {
        message:
          "Waiting for both add-to-cart and cart-info requests to complete",
        timeout: 10000,
      })
      .toBeTruthy();

    // Verify cart UI update
    const cartButton = getCartButton(page);
    await expect(cartButton).toBeVisible();
    await expect(cartButton).toHaveText(/1 item\(s\)/);
  });

  // Generate tests for error scenarios
  for (const scenario of cartMocks.errorScenarios) {
    test(`should show error when product is ${scenario.name}`, async ({
      page,
    }) => {
      // Get initial cart state
      const initialCartText = await getCartButton(page).textContent();

      // Mock the add to cart request
      let errorRequestReceived = false;
      await page.route(cartMocks.endpoints.addToCart, async (route) => {
        errorRequestReceived = true;
        await route.fulfill(createResponse(scenario.response));
      });

      // Try to add product
      const addToCartButton = getAddToCartButton(page);
      await addToCartButton.waitFor({ state: "visible" });
      await addToCartButton.click();

      // Verify request was received
      expect(errorRequestReceived).toBeTruthy();

      // Verify error message
      const errorAlert = getErrorAlert(page);
      await expect(errorAlert).toBeVisible();
      await expect(errorAlert).toContainText(scenario.expectedError);

      // Verify cart hasn't changed
      const cartButton = getCartButton(page);
      const finalCartText = await cartButton.textContent();
      expect(finalCartText).toBe(initialCartText);
    });
  }

  test("should show multiple items in cart", async ({ page }) => {
    let addToCartReceived = false;
    let cartInfoReceived = false;

    // Mock add to cart request
    await page.route(cartMocks.endpoints.addToCart, async (route) => {
      addToCartReceived = true;
      await route.fulfill(createResponse(cartMocks.addToCartResponses.success));
    });

    // Mock the cart info to show multiple items
    await page.route(cartMocks.endpoints.cartInfo, async (route) => {
      cartInfoReceived = true;
      await route.fulfill(
        createResponse(cartMocks.cartInfoResponses.multipleItems)
      );
    });

    // Add product to cart
    const addToCartButton = getAddToCartButton(page);
    await addToCartButton.waitFor({ state: "visible" });
    await addToCartButton.click();

    // Wait for both requests to complete
    await expect
      .poll(() => addToCartReceived && cartInfoReceived, {
        message:
          "Waiting for both add-to-cart and cart-info requests to complete",
        timeout: 10000,
      })
      .toBeTruthy();

    // Verify cart shows multiple items
    const cartButton = getCartButton(page);
    await expect(cartButton).toBeVisible();
    await expect(cartButton).toContainText("3 item(s)");
    await expect(cartButton).toContainText("$72.00");
  });
});
