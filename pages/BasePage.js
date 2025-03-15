export default class BasePage{
    constructor(page){
        this.page = page;
    }

    async goToUrl(url){
        await this.page.goto(url, {waitUntil: 'networkidle2'})
    }

    async waitForNavigation(){
        await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }); // Wait until the network is mostly idle
    }

    async verifyElementPresence(selector){
        await this.page.waitForSelector(selector);
    }

    async selectXpath(xpath) {
        await this.page.waitForSelector(`xpath=${xpath}`, { timeout: 10000 }); // Ensure the element is present
        return this.page.locator(`xpath=${xpath}`);
    }


}