import puppeteer from "puppeteer-extra";
import login from './modules/login.js'
import dotenv from 'dotenv';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import goToProfile from "./modules/goToProfile.js"
import LoginPage from "./pages/LoginPage.js";
import delay from "./utils/delay.js";
import ProfilePage from "./pages/ProfilePage.js";
import { getUrlPath } from "./utils/commonMethods.js";

puppeteer.use(StealthPlugin())

//initialising env variables
dotenv.config();
const email = process.env.LOGIN_EMAIL;
const password = process.env.LOGIN_PASSWORD;
const profileLink = process.env.PROFILE_URL_TEST;


(async ()=>{
    const browser = await puppeteer.launch({headless:false})
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36");
    await page.goto("https://www.pixiv.net/");
    // await page.setViewport({ width: 1920, height: 1080 });
    // creating objects
    const loginPage = new LoginPage(page)
    const profilePage = new ProfilePage(page,profileLink)

    try{
        await loginPage.login(email,password);
        await profilePage.goToProfile();
        await profilePage.getAllBookmarksInPage()
        // await delay(8000)
    } catch(e){
        console.log(e);
    } finally{
        console.log('Closing browser');
        await browser.close();
    }

})()