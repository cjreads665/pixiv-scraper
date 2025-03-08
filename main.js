import puppeteer from "puppeteer-extra";
import login from './modules/login.js'
import dotenv from 'dotenv';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import goToProfile from "./modules/goToProfile.js"

puppeteer.use(StealthPlugin())

dotenv.config();
const email = process.env.LOGIN_EMAIL;
const password = process.env.LOGIN_PASSWORD;
const profileLink = process.env.PROFILE_URL;

(async ()=>{
    const browser = await puppeteer.launch({headless:false})
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36");
    await page.goto("https://www.pixiv.net/");

    try{
        await login(page,email,password);
        // await goToProfile(page,profileLink);
    } catch(e){
        console.log(e);
    } finally{
        await browser.close();
    }

})()