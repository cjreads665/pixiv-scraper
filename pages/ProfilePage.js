import {getUrlPath} from "../utils/commonMethods.js";
import BasePage from "./BasePage.js";

export default class ProfilePage extends BasePage{
    constructor(page,profileLink) {
        this.page = page;
        this.urlPath = getUrlPath(profileLink);
    }


    async verifyProfile(profileLink) { 
        // await this.verifyElementPresence('a[href="/en/users/106094984"]')
        await this.verifyElementPresence(`a[href="${this.urlPath}"]`) //checks out home
    }


    async goToProfile(profileLink) {
        await this.page.goto(profileLink);
        await this.verifyProfile(profileLink);
    }

    async clickBookmarks(){
        await this.page.click(`a[href="${this.urlPath}/bookmarks/artworks"]`)
        await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 })
    }

    async getAllBookmarksInPage(){

        const bookmarks = [];
    }


}