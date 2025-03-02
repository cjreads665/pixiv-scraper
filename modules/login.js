import delay from "../utils/delay.js";

async function login(page) {  // Wrap in an async function
  // More robust way to wait for the login form (or a more specific element)
  await page.waitForSelector('.signup-form', { timeout: 10000 }); // 10-second timeout

  // Improved login button selection (using a CSS selector if possible)
  // Inspect the Pixiv page to find a more specific selector. This is an example:
  const loginButtonLocator = page.locator('a[href*="login"]'); // Example: Looks for <a> tags with "login" in the href
  await loginButtonLocator.click(); // MUST await click


  // Or, if you MUST use text (less reliable):
  // const loginButtonLocator = page.locator('a', { hasText: 'Login' });
  // await loginButtonLocator.click();

  // Wait for the next page to load (important!)
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }); // Wait until the network is mostly idle

  //link to scrap post login -> https://www.pixiv.net/en/users/106094984

  const loginInput = 'input[type="text"]'
  const passInput = 'input[type="password"]'

  await page.type(loginInput,"example");
  await page.type(passInput,"123456");

  const submitBtn = await page.$$('button[type="submit"]')

  const [response] = await Promise.all([
    page.waitForNavigation(),
    submitBtn[4].click()
  ]);

  // await delay(10000)

}

export default login;