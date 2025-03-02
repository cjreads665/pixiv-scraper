import delay from "../utils/delay.js";

async function login(page,email,password) {  
  await page.waitForSelector('.signup-form', { timeout: 10000 }); // 10-second timeout

  const loginButtonLocator = page.locator('a[href*="login"]'); // Example: Looks for <a> tags with "login" in the href
  await loginButtonLocator.click(); // MUST await click


  // Or, if you MUST use text (less reliable):
  // const loginButtonLocator = page.locator('a', { hasText: 'Login' });
  // await loginButtonLocator.click();

  // Wait for the next page to load (important!)
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }); // Wait until the network is mostly idle


  const loginInput = 'input[type="text"]'
  const passInput = 'input[type="password"]'

  await page.type(loginInput,email);
  await page.type(passInput,password);

  await page.waitForSelector('button[type="submit"]');
  const submitBtn = await page.$$('button[type="submit"]')
  await submitBtn[4].click();

  await delay(10000);

  

}

export default login;