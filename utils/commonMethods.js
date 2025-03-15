import puppeteer from "puppeteer-extra";

async function verifyPresenceXPath(page, selector) {
    const el = await page.waitForSelector();
}



export async function getUrlPath(fullUrl) {
    // Create a URL object
    const url = new URL(fullUrl);
    // Extract the pathname
    const path = url.pathname; // This will give you "/en/users/106094984"
    console.log(path); // Output: /en/users/106094984
}


