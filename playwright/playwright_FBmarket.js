const { chromium } = require('playwright');
const path = require( "path" );

const userDataDir = 'C:\\Users\\R324\\AppData\\Local\\Google\\Chrome\\User Data';
// const userDataDir ='/home/pi/.config/chromium';

const DELAY = 10000;
const URL_DELETE = 'https://www.facebook.com/marketplace/you/selling';
const URL_CREATE = 'https://www.facebook.com/marketplace/create/rental';
const NUM_PEOPLE = '2';
const PRICE = '650';
const PRICE2 = String(parseInt(PRICE) + 100);
const AD_DESCRIPTION = `
Room 0 (15'x30')(taken)
Room 1 (10'x9') $${PRICE}/mo (available)
Room 2 (11'x 9') $${PRICE}/mo (available)
Room 3 (11'x 15') $${PRICE2}/mo (available)

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

Please include some information about yourself.  I don't reply to vague details, or people who cannot keep appointments. I only rent to people I meet.
Rooms for rent in large detached house in Kensington Ave N and Cannon st area in Hamilton Central. Very clean house with wood flooring, high ceilings, safe neighbourhood, close to ammenities and malls (Centre Mall, Brock University,grocery), off transit route. This is a great location for school or work.

In terms of visitors, we typically follow the rule of 1 per week (no more than 8 hour stay). This is often a deal breaker for most.  This is room for rent with shared areas with the owner...this is not an apartment.

Keywords: brock university mcmaster professional white collar student safe neighborhood teacher candidate bus route educated educational professionals student students summer winter fall short term season session doctor nurse pharmacist engineer med medical nurse science
`;

// Main Function

(async () => {

    const browser = await chromium.launchPersistentContext(userDataDir,{headless:false, channel:"chrome"});
    // const browser = await chromium.launchPersistentContext(userDataDir,{headless:true, channel:"chromium"});
    
    const openPage = await browser.pages().at(0);
    openPage.setDefaultTimeout(300000);

    let page = await func_delete(openPage, URL_DELETE);

    await func_create(page, URL_CREATE);

    await browser.close();

})();


// Component Functions

const func_delete = async (page, URL) => {

    console.log(func_colorStr('[✔] Start func_delete()'));

    await page.goto(URL);

    await page.waitForTimeout(DELAY);

    let count = await page.locator(`//span[text()="CA$${PRICE}"]`).count();
    
    if (count == 0) {
        console.log(func_colorStr('[✔] No ads listed'));
        return page
    };

    if(count == 1) {
        await page.locator(`//span[text()="CA$${PRICE}"]`).click();
    };

    if(count > 1) {
        await page.locator(`//span[text()="CA$${PRICE}"]`).nth(1).click();
    };

        console.log(func_colorStr('[✔] Ad selected to delete'));

        await page.locator('//span[text()="Delete Listing"]/parent::div/parent::div/div[@role="button"]').click();

        await page.locator('//span[text()="Delete"]').click();
    
        console.log(func_colorStr('[✔] Ad Deleted'));

    return page;
};


const func_create = async (page, URL) => {

    console.log(func_colorStr('[✔] Start func_create()'));

    await page.goto(URL);

    await page.locator('//span[text()="Home for Sale or Rent"]/parent::div').click();

    await page.locator('//span[text()="Rent"]').click();

    console.log(func_colorStr('[✔] Rent selected'));

    
    await page.locator('//span[text()="Rental type"]/parent::div').click();

    await page.locator('//span[text()="House"]').click();

    console.log(func_colorStr('[✔] House selected'));

    
    await page.locator('//span[text()="This is a private room in a shared property."]/parent::div//input').click();

    console.log(func_colorStr('[✔] Private room selected'));

    
    await page.locator('//span[text()="How many people live here?"]/parent::div').click();
    
    await page.locator('//span[text()="How many people live here?"]/following-sibling::input').press(NUM_PEOPLE);

    console.log(func_colorStr(`[✔] ${NUM_PEOPLE} people entered`));

    
    await page.locator('//span[text()="Price per month"]/parent::div').click();
    
    await page.locator('//span[text()="Price per month"]/following-sibling::input').fill(PRICE);

    console.log(func_colorStr('[✔] Price entered'));

    
    await page.locator('//span[text()="Bathroom Type"]/parent::div').click();
    
    await page.locator('//span[text()="Shared"]').click();

    console.log(func_colorStr('[✔] Shared bathroom selected'));

    
    await page.locator('//span[text()="Is this room furnished?"]/parent::div//input').click();

    await page.locator('//span[text()="Number of bedrooms"]/parent::div').click();
    
    await page.locator('//span[text()="Number of bedrooms"]/following-sibling::input').fill('4');

    console.log(func_colorStr('[✔] Bedrooms entered'));

    
    await page.locator('//span[text()="Number of bathrooms"]/parent::div').click();
    
    await page.locator('//span[text()="Number of bathrooms"]/following-sibling::input').fill('2');

    console.log(func_colorStr('[✔] Bathrooms entered'));

    
    await page.locator('//input[@aria-autocomplete="list" and @type="text"]').fill('152 Kensington Ave N, Hamilton, ON L8L 7N5, Canada');

    await page.locator('//span[text()="152 Kensington Ave N, Hamilton, ON L8L 7N5, Canada"]').first().click();
    
    console.log(func_colorStr('[✔] Location selected'));

    
    await page.locator('//textarea').fill(AD_DESCRIPTION);
    
    console.log(func_colorStr('[✔] Ad description entered'));

    
    let arrayFiles = [];
    for(let i=1; i < 10; i++){
        arrayFiles.push(path.join(__dirname,'housePics',`${i}.JPG`))
    };

    await page.locator('//input[@type="file" and contains(@accept,"image")]').setInputFiles(arrayFiles);

    console.log(func_colorStr('[✔] Pictures uploaded'));
    
    
    await page.waitForTimeout(DELAY);

    await page.locator('//span[text()="Next"]/parent::span/parent::div/parent::div/parent::div').click();

    console.log(func_colorStr('[✔] Next selected'));


    await page.waitForTimeout(DELAY);

    await page.locator('//div[@aria-label="Publish"]').click();

    console.log(func_colorStr('[✔] Publish selected'));
    
    return page
};


const func_colorStr = (statement) => {
    let mod_statement = statement
        .replaceAll('✔', '\x1b[32m✔\x1b[0m') // green
    return mod_statement;
};
