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

    async getAllBookmarksInPage(){
        await this.clickBookmarks();
        await this.page.waitForSelector('li')
        await delay(3000) //added delay for other images to load
        const listItems = await this.page.$$('li');
        if (listItems.length > 0) {
            await listItems[1].click();
        } else {
            throw new Error("No list items found");
        }
        await delay(10000)
    }


}