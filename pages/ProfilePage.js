import { autoScroll, getUrlPath } from "../utils/commonMethods.js";
import delay from "../utils/delay.js";
import BasePage from "./BasePage.js";

export default class ProfilePage extends BasePage {
    constructor(page, profileLink) {
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

    async clickBookmarks() {
        let urlPath = await getUrlPath(this.profileLink);
        await this.page.click(`a[href="${urlPath}/bookmarks/artworks"]`)
        // await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 })
    }

    async fetchSrcForReadingWorks() {
        /**
         * const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.example.com');

  // Execute JavaScript in the browser context
  const imageSrcs = await page.evaluate(() => {
    const firstChild = document.querySelectorAll('div[dir="vert"]')[0].children[0];
    const images = firstChild.querySelectorAll('img');
    return Array.from(images).map(img => img.src); // Extract src of all images
  });

  if (imageSrcs.length > 0) {
    console.log('Images found:', imageSrcs);
  } else {
    console.log('No images found.');
  }

  await browser.close();
})();
         */
        await this.page.waitForSelector('div[dir="vert"]')
        const previewContainer = await this.page.$('div[dir="vert"]')
        await autoScroll(this.page)
        const firstChild = await previewContainer.$(':first-child')
        const images = await firstChild?.$$('img') ?? [];
        console.log('Images found:', images.length);
        for (const img of images) {
            const src = await img.evaluate(el => el.src); // Get the src attribute
            console.log('Image src:', src);
        }


    }


    async fetchSrcForShowAll() {
        // Scroll to trigger image loading
        // await this.page.evaluate(() => window.scrollBy(0, document.body.scrollHeight-400));
        // await this.page.waitForSelector('div[role="presentation"]')
        // await delay(60000)
        // Wait for network idle
        // await autoScroll(this.page)
        await this.page.waitForSelector('div[role="presentation"]')
        const previewContainer = await this.page.$('div[role="presentation"]')
        const images = await previewContainer?.$$('img') ?? [];
        console.log('Images found:', images.length);
        for (const img of images) {
            const src = await img.evaluate(el => el.src); // Get the src attribute
            console.log('Image src:', src
            );
        }
    }


    async clickReadingWorks() {
        try {
            // await this.page.set
            // await delay(3000)
            // const showAllBtn = await this.page.waitForSelector(`::-p-xpath(//div[contains(text(), 'Reading works')])`, { timeout: 5000 });
            const showAllBtn = await this.selectXpath("//div[contains(text(), 'Reading works')]");
            if (showAllBtn) {
                await showAllBtn.click();
                await delay(3000)
            }
            await this.fetchSrcForReadingWorks()
        } catch (e) {
            console.log("Reading Works button not found");
        }
    }

    async clickShowAll() {
        try {
            const showAllBtn = await this.page.waitForSelector(`::-p-xpath(//div[contains(text(), 'Show all')])`, { timeout: 5000 });
            if (showAllBtn) {
                await delay(2000)
                await showAllBtn.click();
                await autoScroll(this.page)

            }
        } catch (e) {
            console.log(e); //uncomment for debugging
            console.log("Reading Works button not found. Might be a single image");
            
        }
        await this.fetchSrcForShowAll();
    }

    async getAllBookmarksInPage() {
        await this.clickBookmarks();
        await this.page.waitForSelector('li')
        await delay(3000) //added delay for other images to load
        const listItems = await this.page.$$('li');
        if (listItems.length > 0) {
            await listItems[4].click();
            /**
             * show all is not present in some multi-image arts
             * instead of that, we show 'reading works' -> which opens the image view of pixiv.
             * so we need to come up with solution to capture the pixiv preview images
             * 
             * console:
             * document.querySelectorAll('div[dir="vert"]')[0].children[0]
             * this is selecting the previews alright
             * const firstChild = document.querySelectorAll('div[dir="vert"]')[0].children[0];
                const images = firstChild.querySelectorAll('img'); // Select all <img> elements within the first child
             * 
             * https://stackoverflow.com/questions/69501961/cant-download-image-from-a-website-with-selenium-it-gives-403-error
             * 
             * HELL YEAH!! FOUND THE SOLUTION FROM THE ABOVE STACKOVERFLOW. 
             * just pass referer as https://www.pixiv.net/ to the img srcs and you are good to go
             */
            await this.clickReadingWorks()
            await this.clickShowAll()
            await delay(5000)

            // await this.fetchSrc()
            // await delay(5000)
        } else {
            throw new Error("No list items found");
        }
        await delay(10000)
    }


}