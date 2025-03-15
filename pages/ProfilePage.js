import {getUrlPath} from "../utils/commonMethods.js";
import delay from "../utils/delay.js";
import BasePage from "./BasePage.js";

export default class ProfilePage extends BasePage{
    constructor(page,profileLink) {
        super(page)
        this.page = page;
        this.profileLink = profileLink        
    }


    async verifyProfile() { 
        let urlPath = await getUrlPath(this.profileLink);
        await this.verifyElementPresence(`a[href="${urlPath}"]`) //checks out home
    }

    // async test(){
    //     console.log(getUrlPath(profileLink));

    // }

    async goToProfile() {
        await this.page.goto(this.profileLink);
        delay(2000)
        await this.verifyProfile();
    }

    async clickBookmarks(){
        let urlPath = await getUrlPath(this.profileLink);
        await this.page.click(`a[href="${urlPath}/bookmarks/artworks"]`)
        // await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 })
    }

    async clickShowAll(){
        try {
            // await this.page.set
            // await delay(3000)
            const showAllBtn = await this.page.waitForSelector(`::-p-xpath(//div[contains(text(), 'Reading works')])`, { timeout: 5000 });
            if (showAllBtn) {
                await showAllBtn.click();
            }
        } catch (e) {
            console.log("Show all button not found");
        }
    }

    async getAllBookmarksInPage(){
        await this.clickBookmarks();
        await this.page.waitForSelector('li')
        await delay(3000) //added delay for other images to load
        const listItems = await this.page.$$('li');
        if (listItems.length > 0) {
            await listItems[3].click();
            /**
             * show all is not present in some multi-image arts
             * instead of that, we show 'reading works' -> which opens the image view of pixiv.
             * so we need to come up with solution to capture the pixiv preview images
             * 
             * console:
             * document.querySelectorAll('div[dir="vert"]')[0].children[0]
             * this is selecting the previews alright
             * https://stackoverflow.com/questions/69501961/cant-download-image-from-a-website-with-selenium-it-gives-403-error
             * 
             * HELL YEAH!! FOUND THE SOLUTION FROM THE ABOVE STACKOVERFLOW. 
             * just pass referer as https://www.pixiv.net/ to the img srcs and you are good to go
             */
            this.clickShowAll()

            await delay(5000)
        } else {
            throw new Error("No list items found");
        }
        await delay(10000)
    }


}