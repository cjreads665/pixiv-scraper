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


export async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}


export function getTotalImg(text) {
    const totalImages = text.split('/')[1]; // Extract "2" from "1/2"
    console.log(`Total images: ${totalImages}`); // Output: "Total images: 2"
    return totalImages;
}

export function parseNumberStringWithComma(numberString) {
    // Remove commas and parse the number
    const parsedNumber = parseFloat(numberString.replace(/,/g, ""));
    return parsedNumber;
}