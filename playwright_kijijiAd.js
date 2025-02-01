const { chromium } = require('playwright');
const path = require( "path" );

const URL_LOGIN = 'https://www.kijiji.ca/b-hamilton/l80014';
const URL_ADS = 'https://www.kijiji.ca/m-my-ads/active/1';
const URL_POSTAD = 'https://www.kijiji.ca/p-select-category.html';
const USER = 'pawn88@live.com';
const PASS = 'westside';
const PRICE = '650';
const AD_TITLE = `$${PRICE}/mo room Kensington / Cannon - Professionals / Students`;
const AD_DESCRIPTION = `
Please include some information about yourself.  I don't reply to vague details, or people who cannot keep appointments. I only rent to people I meet.
Rooms for rent in large detached house in Kensington Ave N and Cannon st area in Hamilton Central. Very clean house with wood flooring, high ceilings, safe neighbourhood, close to ammenities and malls (Centre Mall, Brock University,grocery), off transit route. This is a great location for school or work.

Room 0 (15'x30')( taken)
Room 1 (10'x9') $${PRICE}/mo (available)
Room 2 (11'x 9') $${PRICE}/mo (available)
Room 3 (11'x 15') $${PRICE+100}/mo (available)

Street and private parking available.

Includes:
* two x 3-piece bathroom
* large kitchen with dishes and utensils
* living and dining space with furnishings
* Electric and heating utilities
* fibe/high speed internet included

Prefer non-smoker, clean, punctual, quiet, no pets
Excellent for STUDENTS or PROFESSIONALS
Available immediately

In terms of visitors, we typically follow the rule of 1 per week (no more than 8 hour stay). This is often a deal breaker for most.  This is room for rent with shared areas with the owner...this is not an apartment.

Keywords: brock university mcmaster professional white collar student safe neighborhood teacher candidate bus route educated educational professionals student students summer winter fall short term season session doctor nurse pharmacist engineer med medical nurse science
`;

// Main Function

(async()=>{

    const browser = await chromium.launch({headless:true});
    const context = await browser.newContext();
    const openPage = await context.newPage();
    openPage.setDefaultTimeout(300000);

    console.log('\x1b[34m[] func_auth [] func_checkAd [] Ad Details [] Description [] Pictures [] func_postAd\x1b[0m');

    let page = await func_auth(openPage, URL_LOGIN);

    await func_checkAd(page);

    await func_postAd (page);

    await func_timeDelay();

    await browser.close();

})();


// Component Functions

const func_auth = async (page, URL) => {

    await page.goto(URL);

    await page.locator('//button[contains(text(),"Sign In")]').click();

    await page.locator('//input[@id="username"]').fill(USER);

    await page.locator('//input[@id="password"]').pressSequentially(PASS,{delay:500})

    await page.keyboard.press('Enter');

    await func_timeDelay(10000);
    
    console.log('[\x1b[32m✔\x1b[0m] func_auth');

    return page
};


const func_checkAd = async (page)=>{
    
    await page.goto(URL_ADS);
    
    let adNum = await page.locator('//div[contains(text(),"Active")]/span[1]').evaluate(e=>e.innerText);

    if(adNum == 1){

        await page.locator('//span[contains(text(),"Delete")]').click();

        await page.locator('//button[contains(text(),"Prefer not to say")]').click();

        await page.locator('//button[contains(text(),"Delete My Ad")]').click();
    };

    console.log('[\x1b[32m✔\x1b[0m] func_checkAd');
};


const func_postAd = async (page)=>{

    await page.goto(URL_POSTAD);

    await page.locator('//textarea[@id="AdTitleForm"]').fill(AD_TITLE);

    await page.keyboard.press('Enter');
    
    await page.locator('//span[contains(text(),"Real Estate") and contains(@class,"categoryName")]').click();

    await page.locator('//span[contains(text(),"For Rent") and contains(@class,"categoryName")]').click();

    await page.locator('//span[contains(text(),"Room Rentals & Roommates") and contains(@class,"level3Category")]').click();

    console.log('[\x1b[32m✔\x1b[0m] Ad Details');

    await page.locator('//span[contains(text(),"I am offering")]').click();

    await page.locator('//label[contains(text(),"Furnished")]').click();

    await page.locator('//label[@for="petsallowed_s-1"]').click();
    
    await page.locator('//input[@id="postad-title"]').fill(AD_TITLE);

    await page.locator('//textarea[@name="postAdForm.description"]').fill(AD_DESCRIPTION);

    console.log('[\x1b[32m✔\x1b[0m] Description');

    let arrayFiles = [];
    for(let i=1; i < 10; i++){
        arrayFiles.push(path.join(__dirname,'housePics',`${i}.JPG`))
    };

    await page.locator('//input[@type="file"]').setInputFiles(arrayFiles);
    
    console.log('[\x1b[32m✔\x1b[0m] Pictures');

    await page.locator('//input[@name="postAdForm.priceAmount"]').fill(PRICE);

    await page.locator('//h3[contains(text(), "Lite")]/parent::*/parent::*').locator('//button').click();

    await func_timeDelay(300000);

    await page.locator('//button[@type="submit" and contains(text(),"Post")]').click();

    console.log('[\x1b[32m✔\x1b[0m] func_postAd');
};


const func_timeDelay = async (time=5000) => {

    await new Promise(resolve =>setTimeout(async()=>{await resolve()}, time));

}; 