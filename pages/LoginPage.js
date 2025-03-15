import delay from "../utils/delay.js";
import BasePage from "./BasePage.js";

export default class LoginPage extends BasePage {
    constructor(page) {
        super(page)
        this.page = page
        this.emailField = 'input[type="text"]'
        this.passwordField = 'input[type="password"]'
        this.submitBtn = "//button[normalize-space()='Log In']"
    }


    async navigateToLogin() {
        await this.page.waitForSelector('.signup-form', { timeout: 10000 }); // 10-second timeout
        const loginButtonLocator = this.page.locator('a[href*="login.php"]'); // Example: Looks for <a> tags with "login" in the href
        await loginButtonLocator.click(); // MUST await click
        await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 })
    }

    async login(email, password) {
        await this.navigateToLogin();
        await this.page.type(this.emailField, email);
        await this.page.mouse.move(100, 200);
        await this.page.type(this.passwordField, password);
        await this.page.mouse.move(200, 100);
        const submitBtn = await this.page.waitForSelector(`::-p-xpath(//button[normalize-space()='Log In'])`)
        await submitBtn.click();
        await this.verifyLogin();
    }

    async verifyLogin() {
        await this.page.evaluate(() => window.scrollBy(0, 300));
        await delay(3000);
        await this.page.waitForSelector('input[placeholder="Search works"]', { timeout: 50000 })
    }


}