import { test, expect } from "@playwright/test";
import { cartMocks } from "./mocks/cart.mocks";

test.describe('Shopping Cart', () => {
  test("should successfully add product to cart", async ({ page }) => {
   
    await page.goto("https://demo-opencart.com/");
    await page.waitForLoadState("networkidle");

    
    let addToCartReceived = false;
    let cartInfoReceived = false;
    
    // Mock add to cart request
    await page.route("**/index.php?route=checkout/cart|add**", async (route) => {
      addToCartReceived = true;
      console.log('Intercepted add to cart request:', {
        url: route.request().url(),
        method: route.request().method(),
        postData: route.request().postData()
      });
      
      const response = {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Success: You have added Sample Product to your shopping cart!"
        })
      };
      await route.fulfill(response);
    });

    // Mock the cart info request that updates the UI
    await page.route("**/index.php?route=common/cart|info**", async (route) => {
      cartInfoReceived = true;
      console.log('Intercepted cart info request:', {
        url: route.request().url(),
        method: route.request().method()
      });
      const response = {
        status: 200,
        contentType: "text/html",
        body: cartMocks.cartInfoResponses.oneItem.body
      };
      await route.fulfill(response);
    });

    // Add debug logging for all requests
    page.on('request', request => {
      if (request.url().includes('cart')) {
        console.log('Debug - Cart Request URL:', request.url());
      }
    });

    // Trigger the add to cart action
    const addToCartButton = page.locator('.button-group button:first-child').first();
    await addToCartButton.waitFor({ state: "visible" });
    await addToCartButton.click();

    // Wait for both requests to complete
    await expect.poll(() => addToCartReceived && cartInfoReceived, {
      message: 'Waiting for both add-to-cart and cart-info requests to complete',
      timeout: 10000
    }).toBeTruthy();

    // Verify cart UI update from our mocked response
    const cartButton = page.locator('button[data-bs-toggle="dropdown"].btn-inverse');
    await expect(cartButton).toBeVisible();
    await expect(cartButton).toHaveText(/1 item\(s\)/);
  });

  test("should show error when product is out of stock", async ({ page }) => {
    await page.goto("https://demo-opencart.com/");
    await page.waitForLoadState("networkidle");

    // Get initial cart state for comparison
    const initialCartText = await page.locator('button[data-bs-toggle="dropdown"].btn-inverse').textContent();

    // Enable debug logging for responses
    page.on('response', async response => {
      try {
        const contentType = response.headers()['content-type'];
        if (contentType && contentType.includes('application/json')) {
          console.log('Response URL:', response.url());
          console.log('Response body:', await response.text());
        }
      } catch (e) {
        // Ignore response body parsing errors
      }
    });

    // Mock the add to cart request for out of stock product
    let outOfStockRequestReceived = false;
    await page.route("**/index.php?route=checkout/cart|add**", async (route) => {
      outOfStockRequestReceived = true;
      const response = {
        status: 200, // Change to 200 as the site expects success status
        contentType: "application/json",
        body: JSON.stringify({
          error: "Product is out of stock",
          success: false
        })
      };
      await route.fulfill(response);
    });

    // Try to add out of stock product
    const addToCartButton = page.locator('.button-group button:first-child').first();
    await addToCartButton.waitFor({ state: "visible" });
    await addToCartButton.click();

    // Verify error request was received
    expect(outOfStockRequestReceived).toBeTruthy();

    // Take screenshot for debugging
    await page.screenshot({ path: 'error-state.png' });

    // Verify error message is shown (using more general alert selector)
    const errorDiv = page.locator('.alert');
    await expect(errorDiv).toBeVisible();
    await expect(errorDiv).toContainText("Product is out of stock");

    // Verify cart hasn't changed
    const cartButton = page.locator('button[data-bs-toggle="dropdown"].btn-inverse');
    const finalCartText = await cartButton.textContent();
    expect(finalCartText).toBe(initialCartText);
  });
});
