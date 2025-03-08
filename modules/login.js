import { timeout } from "puppeteer";
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
  await page.mouse.move(100, 200);
  await page.type(passInput,password);
  await page.mouse.move(200, 100);


  await page.waitForSelector('button[type="submit"]');

  delay(2000)
  // const submitBtn = await page.$$('button[type="submit"]')
  const submitBtn = await page.waitForSelector(`::-p-xpath(//button[normalize-space()='Log In'])`)
  await submitBtn.click();
  // await submitBtn[4].click();

  await page.evaluate(() => window.scrollBy(0, 300));

  // await delay(25000);

  await page.waitForSelector('input[placeholder="Search works"]',{timeout:50000})

}

export default login;