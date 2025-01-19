export const cartMocks = {
 
  addToCartResponses: {
    success: {
      status: 200,
      contentType: "application/json",
      body: {
        success: "Success: You have added a MOCK Product to your shopping cart!",
        
      }
    },
    outOfStock: {
      status: 200,
      contentType: "application/json",
      body: { 
        success:  "Product is out of stock",
       
      }
    },
    invalidQuantity: {
      status: 200,
      contentType: "application/json",
      body: {
        success: "Invalid quantity selected",
        
      }
    },
    requiresOptions: {
      status: 200,
      contentType: "application/json",
      body: {
        success: "Please select required product options",
        
      }
    }
  },

  // Cart info HTML responses
  cartInfoResponses: {
    empty: {
      status: 200,
      contentType: "text/html",
      body: `<div id="cart">
        <button type="button" data-bs-toggle="dropdown" class="btn btn-inverse dropdown-toggle">
          <i class="fa-solid fa-cart-shopping"></i> 0 item(s) - $0.00
        </button>
      </div>`
    },
    oneItem: {
      status: 200,
      contentType: "text/html",
      body: `<div id="cart">
        <button type="button" data-bs-toggle="dropdown" class="btn btn-inverse dropdown-toggle">
          <i class="fa-solid fa-cart-shopping"></i> 1 item(s) - $24.00
        </button>
      </div>`
    },
    multipleItems: {
      status: 200,
      contentType: "text/html",
      body: `<div id="cart">
        <button type="button" data-bs-toggle="dropdown" class="btn btn-inverse dropdown-toggle">
          <i class="fa-solid fa-cart-shopping"></i> 3 item(s) - $72.00
        </button>
      </div>`
    }
  },

  // Test scenarios
  errorScenarios: [
    {
      name: "out of stock",
      response: {
        status: 200,
        contentType: "application/json",
        body: {
          success: false,
          error: "Product is out of stock"
        }
      },
      expectedError: "Product is out of stock"
    },
    {
      name: "invalid quantity",
      response: {
        status: 200,
        contentType: "application/json",
        body: {
          success: false,
          error: "Invalid quantity selected"
        }
      },
      expectedError: "Invalid quantity selected"
    },
    {
      name: "missing required options",
      response: {
        status: 200,
        contentType: "application/json",
        body: {
          success: false,
          error: "Please select required product options"
        }
      },
      expectedError: "Please select required product options"
    }
  ],

  // API endpoints
  endpoints: {
    addToCart: "**/index.php?route=checkout/cart|add**",
    cartInfo: "**/index.php?route=common/cart|info**"
  },

  // Selectors
  selectors: {
    cartButton: 'button[data-bs-toggle="dropdown"].btn-inverse',
    addToCartButton: '.button-group button:first-child',
    errorAlert: '.alert'
  },

  // Sample product data
  products: {
    inStock: {
      id: 51,
      quantity: 1,
      name: "Sample Product"
    },
    withOptions: {
      id: 52,
      quantity: 1,
      name: "Product with Options",
      requiredOptions: ["Size", "Color"]
    },
    outOfStock: {
      id: 53,
      quantity: 0,
      name: "Out of Stock Product"
    }
  }
}; 