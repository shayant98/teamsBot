const puppeteer  = require("puppeteer")
const schedule = require('node-schedule');
const { parseTime, parseDate, calculateEndTime } = require('./helpers');
require('dotenv').config()

const  URL = process.env.MS_URL;
let page;
let browser
const gotoPage = async () => {
     browser = await puppeteer.launch({headless: false});
    const context = browser.defaultBrowserContext();
    context.clearPermissionOverrides();
    context.overridePermissions(URL, []);

    page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768});
    await page.goto(URL);
    console.log("-- GOING TO TEAMS --");
    await page.waitForSelector("#idSIButton9");
    if(page.url().includes("login")){
        console.log("-- LOGIN PAGE --");

        await login();
    }

    console.log("-- HOME PAGE --");
    await page.waitForSelector('#app-bar-ef56c0de-36fc-4ef8-b417-3d82ba9d073c')
    await page.click("#app-bar-ef56c0de-36fc-4ef8-b417-3d82ba9d073c")
    wait(4000)
    await joinClass();

    
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.screenshot({path: 'example.png'});

}


const login = async () => {
    await page.type('#i0116', process.env.MS_EMAIL);
    await page.click('#idSIButton9');
    await page.waitForSelector('#i0118')
    await page.type('#i0118', process.env.MS_PASS);
    await wait(2000)
    await page.click('#idSIButton9');
    await wait(2000)
    await page.click('#idSIButton9');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await useWebVersion()
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

}

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
 
const useWebVersion = async () => {
    await page.click('a.use-app-lnk');
}


const joinClass = async (startTime, endTime) => {
    console.log("-- CALANDER PAGE --");

    try {
       await wait(15000);
        
        await page.click("button.node_modules--msteams-bridges-components-calendar-event-card-dist-es-src-renderers-event-card-renderer-event-card-renderer__joinButton--1AeXc");
        console.log("-- JOINING MEET  --");

    }
    catch (error) {
        let joinTry = 1;
        while (joinTry <= 30) {
            wait(100000)
            console.error("Join button not found, trying again");
            await page.reload();
            
           await joinClass()
            joinTry++;
        }
    }

   //Select continue without webcam
   await page.waitForSelector('button.ts-btn')
   await page.click("button.ts-btn");

    // press join
    await wait(5000)
    const  joinButton = await page.$x('//*[@id="page-content-wrapper"]/div[1]/div/calling-pre-join-screen/div/div/div[2]/div[1]/div[2]/div/div/section/div[1]/div/div/button')
    await joinButton[0].click() 
    console.log("-- JOINED MEET  --");

    
    
    //wait for class duration 21:15
    await wait(calculateEndTime());
    const  homeButton = await page.$x('//*[@id="teams-app-bar"]/ul/li[3]')
    await homeButton[0].click() 
    wait(1000)

    //Hang up
    const  hangUpButton = await page.$x('//*[@id="hangup-button"]')
    await hangUpButton[0].click() 
    console.log("-- LEFT MEET  --");
    await wait(10000);
    await browser.close()

    
}

const scheduleClasses = async () => {
schedule.scheduleJob(process.env.CRON_TIME, async (fireDate) => {
         await gotoPage()
      });
   
    
}


const init =() =>{
    // Welcome to the Teams Bot
    console.log("Welcome to The Teams Bot");
    scheduleClasses()
}

init()





