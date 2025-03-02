import puppeteer from "puppeteer";
import login from './modules/login.js'
(async ()=>{
    const browser = await puppeteer.launch({headless:false})
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36");
    await page.goto("https://www.pixiv.net/");

    try{
        await login(page);
    } catch(e){
        console.log(e);
    } finally{
        await browser.close();
    }

})()