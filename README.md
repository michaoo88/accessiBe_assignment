# AccessiBe Assignment - E2E Testing Suite

This project contains end-to-end (E2E) tests using Playwright to validate web application functionality on saucedemo.com and api-mock tests on demo-opencart.com.

## Project Overview

The test suite covers various aspects of web application testing including:
- Navigation flows
- Login functionality
- Form validation
- Cross-browser compatibility
- API routing

## Prerequisites

- Node.js 
- npm 

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd accessibe_assignment
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add necessary environment variables 

## Running Tests

The project includes two main test scripts:

### Headless Mode (CI/CD)
```bash
npm run test_headless
```

### Headed Mode (Development)
```bash
npm run test_headed
```

## Test Structure

Tests are organized in the `tests` directory:
- `navigation.spec.js` - Navigation flow tests
- `login.spec.js` - Login functionality tests
- `form_validation.spec.js` - Form validation tests
- `api_routing.spec.js` - API routing tests
## Configuration

The project uses Playwright's configuration file (`playwright.config.js`) which includes:
- Parallel test execution
- Cross-browser testing (Chromium, Firefox, Safari)
- HTML test reporting
- Trace capture on test failure

## Project Dependencies

### Main Dependencies
- `@playwright/test` - Testing framework
- `dotenv` - Environment variable management

## Reports

After test execution, HTML reports are automatically generated and can be viewed using the Playwright report viewer.

