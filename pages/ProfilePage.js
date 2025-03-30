import { autoScroll, getUrlPath, parseNumberStringWithComma } from "../utils/commonMethods.js";
import delay from "../utils/delay.js";
import BasePage from "./BasePage.js";

export default class ProfilePage extends BasePage {
    constructor(page, profileLink) {
        super(page)
        this.page = page;
        this.profileLink = profileLink;
        this.imgArray = [];
        this.detachedElements = []
    }

    async getImgArray() {

        return await this.imgArray;
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


    async getTotalImg() {
        const text = await page.$eval(
            '[aria-label="Preview"]', //this is the count span
            (el) => el.textContent.trim() // Returns "1/2" or similar
        );
        if (text) {
            const totalImages = text.split('/')[1]; // Extract "2" from "1/2"
            console.log(`Total images: ${totalImages}`); // Output: "Total images: 2"
        } else {
            console.log("no preview count found");

        }

        return totalImages;
    }

async detachedElementcollection(){
    return this.detachedElements
}

async getTotalWorks(){
    await delay(2000)
    const textContent = await this.page.$eval('h2 ~ div', el => el.textContent.trim());

    console.log(textContent); // Should print '1,884'
    return parseNumberStringWithComma(textContent);
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
        // await autoScroll(this.page)
        await autoScroll(this.page)
        console.log("passed autoscroll");
        delay(20000)
        const previewContainer = await this.page.$('div[dir="vert"]')
        const firstChild = await previewContainer.$(':first-child')
        const images = await firstChild?.$$('img') ?? [];
        console.log('Images found:', images.length);
        for (const img of images) {
            const src = await img.evaluate(el => el.src); // Get the src attribute
            console.log('Image src:', src);
            this.imgArray.push(src);
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
            this.imgArray.push(src);
        }
    }


    async clickReadingWorks() {
        try {
            // await this.page.set
            // await delay(3000)
            // const showAllBtn = await this.page.waitForSelector(`::-p-xpath(//div[contains(text(), 'Reading works')])`, { timeout: 5000 });
            const readingWorksBtn = await this.selectXpath("//div[contains(text(), 'Reading works')]");
            if (readingWorksBtn) {
                await readingWorksBtn.click();
                await delay(3000)


            }
            await this.fetchSrcForReadingWorks()
        } catch (e) {
            console.log("Reading Works button not found");
            console.log(e);

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
            /**
             * handling the single image case inside showall.
             * so when there is single image, we skip scrolling
             * and extract the image srcs directly
             */
        } catch (e) {
            // console.log(e); //uncomment for debugging
            console.log("Show All button not found. Might be a single image");

        }
        await this.fetchSrcForShowAll();
    }

    async clickSpoilerShow() {
        //sometimes pixiv asks for confirmation for spoilers art
        const buttons = await this.page.$$('button');
        for (const button of buttons) {
            const buttonText = await button.evaluate(el => el.textContent.trim());
            if (buttonText === 'Show') {
                await button.click();
                console.log("Clicked the 'Show' button");
                break;
            }
        }
    }

    async fetchOnlySrc() {
        await delay(2000)
        await this.clickSpoilerShow()
        console.log("waiting for preview");

        const canvasEl = await this.page.$('canvas')
        const previewContainer = await this.page.$('div[role="presentation"]')
        if (canvasEl) {
            console.log("Canvas element detected. Skipping fetchOnlySrc.");
            console.log("going back to the previous page");
            
            await this.page.goBack();

            return; //skip the function
        } else if(!previewContainer){
            console.log("Preview container not found. Skipping fetchOnlySrc.");
            return; //skip the function
        }

        await this.page.waitForSelector('div[role="presentation"] img')
        const img = await previewContainer?.$('img');
        const artName = await this.page.$('h1');

        if(artName){
            const artNameText = await artName.evaluate(el => el.textContent.trim());
            console.log(`Art name: ${artNameText}`);
        } else{
            console.log("Art name not found. check index and find the image manually");
        }
        /**
         * for index 19, we are getting:
         * TypeError: Cannot read properties of null (reading 'evaluate')
    at ProfilePage.fetchOnlySrc (file:///home/cj/Desktop/scripts/pixiv-scraper/pages/ProfilePage.js:198:43)
    at async ProfilePage.getAllBookmarksInPage (file:///home/cj/Desktop/scripts/pixiv-scraper/pages/ProfilePage.js:300:17)
    at async file:///home/cj/Desktop/scripts/pixiv-scraper/main2.js:33:9
         */

        let count = 0;
        //checking if counter for the images is present or not
        try {
            const countLabelElement = await this.page.$('[aria-label="Preview"]');
            const countLabel = await countLabelElement.evaluate(el => el.textContent.trim());
            console.log(countLabel);
            const totalImages = countLabel.split('/')[1]; // Extract "2" from "1/2"
            console.log(`Total images: ${totalImages}`); // Output: "Total images: 2"
            count = parseInt(totalImages);
        } catch (e) {
            console.log("No count span found");
            // console.log(e); //uncomment for debugging

        }
        /**
         * get the preview span -> if it is present, use a function
         */
        const src = await img.evaluate(el => el.src); // Get the src attribute
        // console.log('Original Image src:', src); //for debugging
        if (count == 0) {
            this.imgArray.push(src);
            console.log("single image detected: "+src);
            
        } else {
            for (let i = 0; i < count; i++) {
                let newSrc = src.replace(/_p0_/g, `_p${i}_`);
                console.log(`newSrc: ${newSrc}`);
                this.imgArray.push(newSrc);
            }
        }
        // this.imgArray.push(src);
        await this.page.goBack();


    }




    async getAllBookmarksInPage() {
        await this.clickBookmarks();


        let totalWorks = await this.getTotalWorks();
        let numberOfPages = Math.ceil(totalWorks / 48); // Divide totalWorks by 48 and round up to get the number of pages

        let currentUrl = await this.page.url();
for(let j=1;j<=numberOfPages;j++){
    let newUrl = currentUrl.concat(`?p=${j}`)
    await this.page.goto(newUrl)
    console.log("Current URL: " + newUrl);
    console.log(`number of pages: ${numberOfPages}`);
    console.log(`total works: ${totalWorks}`);
    
    await this.page.waitForSelector('li')
    await delay(3000) //added delay for other images to load
    let listItems = await this.page.$$('li');
    if (listItems.length > 0) {

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




        /* pausing ui based src fetching. if u want to continue, uncomment the next 2 lines ONLY
        then debug and do whatever u want
        current the readingworks is unabl to fetch all images. show all is working fine  
        */
        // await this.clickReadingWorks()
        // await this.clickShowAll()
        for (let i = 1; i < listItems.length; i++) {
            // Re-query the list item to ensure it's still valid
            listItems = await this.page.$$('li');
            const listItem = listItems[i];
            if (!listItem) {
                console.log(`List item at index ${i} and page ${j} is no longer available`);
                let k = `Skipping list item at index ${i} and page ${j} due to unavailability.`
                console.log(k);

                listItems = await this.page.$$('li'); // Re-query the list items to ensure the loop continues correctly
                continue;
            }
            console.log(`Clicking list item at index ${i} and page ${j}`);
            console.log(`number of list items in this page: ${listItems.length}`);
            

            await listItem.click();
            await this.fetchOnlySrc();
            await delay(2000);
            console.log(await this.getImgArray());

            await delay(3000);
        }

        console.log("last image array length: " + (await this.getImgArray()).length);
        const imgArray = await this.getImgArray();
        if (imgArray.length > 0) {
            console.log("Last image in array: " + imgArray[imgArray.length - 1]);
            console.log("detached elements: " + await this.detachedElements.length);
        } else {
            console.log("Image array is empty.");
        }
        
        // await this.fetchSrc()
        // await delay(5000)
    } else {
        throw new Error("No list items found");
    }
}


        // await delay(10000)
    }


}