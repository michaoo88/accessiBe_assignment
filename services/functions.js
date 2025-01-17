//Function to login user
export async function loginUser(page, username, password) {
    await page.locator('[data-test="username"]').fill(username);
    await page.locator('[data-test="password"]').fill(password);
    await page.locator('[data-test="login-button"]').click();
}

//Function to logout user
export async function logoutUser(page) {
    await page.locator('[data-test="logout-button"]').click();
}


module.exports = {
    loginUser,
    logoutUser
}
