import puppeteer from "puppeteer-extra";

export async function verifyPresenceXPath(page, selector) {
    const el = await page.waitForSelector();
}

export async function getUrlPath(fullUrl) {
    if (!fullUrl) {
        throw new Error("Invalid URL");
    }
    // Create a URL object
    const url = new URL(fullUrl);
    // Extract the pathname
    const path = url.pathname; // This will give you "/en/users/106094984"
    console.log(`Extracted path: ${path}`); // Output the extracted path
    return path;
}


