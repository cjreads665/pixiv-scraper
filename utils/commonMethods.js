import puppeteer from "puppeteer-extra";

async function verifyPresenceXPath(page,selector){
    const el = await page.waitForSelector();
}

