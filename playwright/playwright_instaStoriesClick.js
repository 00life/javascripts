const { chromium } = require('playwright');

// const userDataDir = 'C:\\Users\\R324\\AppData\\Local\\Google\\Chrome\\User Data';
const userDataDir ='/home/pi/.config/chromium';

// Main Function
(async () => {
    const args = ["--window-position=0,0"];
    const viewport = {width: 1260, height: 740};
    const userAgent = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/24.0 Chrome/117.0.0.0 Mobile Safari/537.36";
    const otherOpt = {acceptDownloads: true, persistentContext: true, viewport, userAgent};
    const browserOpt = {headless: true, channel: "chromium", args, ...otherOpt};
    const browser = await chromium.launchPersistentContext(userDataDir, browserOpt);
    
    const page = await browser.pages().at(0);
    page.setDefaultTimeout(300000);
    console.log('[✔] Open browser');
    
    await page.goto('https://m.instagram.com/');
    await page.waitForTimeout(1000);
    console.log('[✔] Visit https://m.instagram.com/');

    await page.locator('//div[@role="button" and contains(@aria-label,"Story by")]').first().click();
    console.log('[✔] Click on Stories');
  
    await page.evaluate(e=>{
        let arr_true = [];

        let loop = setInterval( () => {
            window?.document?.querySelector('svg[aria-label="Next"]')?.parentElement.click();
            let elem_next = window?.document?.querySelector('svg[aria-label="Next"]');
            
            if(elem_next == null) arr_true.push(true);
            if(arr_true.length > 50) clearInterval(loop)
        }, 100)
    });

    setTimeout(async()=>await browser.close(), 2*60*1000);
})();
