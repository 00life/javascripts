const { chromium } = require('playwright');
const sounddata = require('./soundaudio.json');

const ARRAY_SUBJECTS = ['math', 'science', 'library', 'geography', 'physics', 'chemistry', 'biology', 'career'];
const ARRAY_SCHOOLS_1 = ["glendale", "winston", "bernie","cathedral", "newman"];
const ARRAY_SCHOOLS_2 = ["henderson", "westdale", "westmount" ,"sherwood","brebeuf"];
const ARRAY_SCHOOLS_3 = ["saltfleet", "orchard"];

const STATUS = 'open';
const PAY = '100%';

// Main Function

(async () => {
    
    const browser = await chromium.launch({headless:false});
    const context = await browser.newContext();
    
    // const openPage1 = await context.newPage();
    const openPage2 = await context.newPage();
 
    // openPage1.setDefaultTimeout(300000);
    openPage2.setDefaultTimeout(300000);

    // let page_c = await func_auth(openPage1, 'https://hwcdsb.simplication.com/WLSBLogin.aspx');
    let page_p = await func_auth(openPage2, 'https://hwdsb.simplication.com/WLSBLogin.aspx');  
    
    while (true) {
        
        // await func_assignOffer(page_c, 'https://hwcdsb.simplication.com/Applicant/AttOccasionalPostings.aspx?TAB=PA');
        await func_jobBoard(page_p, 'https://hwdsb.simplication.com/Applicant/AttOccasionalJobBoard.aspx');
    };
})();


// Component Functions

const func_auth = async (page, URL) => {

    await page.goto(URL);

    await page.locator('//input[@placeholder="Enter username or email"]').fill('rezatahirkheli');
    
    await page.click('//input[@value="Next"]');
    
    await page.locator('//span[text()="Password"]/parent::*/following-sibling::*[1]').pressSequentially('Westside99', {delay:100});
    
    await page.locator('//input[@value="Sign In"]').click();

    console.log('[\x1b[32m✔\x1b[0m] func_auth ' + URL.slice(0,15));

    return page;
};


const func_assignOffer = async (page, URL) => {

    await page.waitForTimeout(10000);

    await func_continue(page);
        
    await func_relog(page, 'https://hwcdsb.simplication.com/WLSBLogin.aspx');

    await page.goto(URL);

    await page.locator('//input[@id="ctl00_ContentPlaceHolder1_chkOpenPostingsOnly"]').click();
        
    let rows = await page.locator('//a[@class="AbsenceEx"]/parent::td/parent::tr'); // Array Rows
        
    if(Array.from(await rows.all()).length == 0){return}; //Guard Clause

    for(let row of await rows.all()) {
            
        //Variables Strings
        let pay = await row.locator('//td[2]').evaluate(e=>e.innerText);
        let sub = await row.locator('//td[3]').evaluate(e=>e.innerText);
        let school = await row.locator('//td[4]').evaluate(e=>e.innerText.split('\n')[0]);
        let status = await row.locator('//td[7]').evaluate(e=>e.innerText);
            
        // Array Splits
        let array_school = school.split(' ').map(e=>e.toLowerCase());
        let array_sub = sub.split(' ').map(e=>e.toLowerCase());

        // Boolean Conditions
        let bool_school_1 = ARRAY_SCHOOLS_1.some(e=>array_school.includes(e.toLowerCase()));
        let bool_school_2 = ARRAY_SCHOOLS_2.some(e=>array_school.includes(e.toLowerCase()));
        let bool_school_3 = ARRAY_SCHOOLS_3.some(e=>array_school.includes(e.toLowerCase()));
        let bool_sub = ARRAY_SUBJECTS.some(e=>array_sub.includes(e.toLowerCase()));
        let bool_status = status.toLowerCase() == STATUS.toLowerCase() ? true : false;
        let bool_pay = pay.toLowerCase() == PAY.toLowerCase() ? true : false;
            
        // Nested Ternary Operators
        (bool_status && bool_pay && "library".includes(sub.toLowerCase())) ? await func_audio(page,"sound_bing") : null;
        (bool_status && bool_pay && bool_sub && bool_school_1) ? await func_audio(page,"sound_click") : null;
        (bool_status && bool_pay && bool_sub && bool_school_2) ? await func_audio(page,"sound_tick") : null;
        (bool_status && bool_pay && bool_sub && bool_school_3) ? await func_audio(page,"sound_shake") : null;
    };
};


const func_jobBoard = async (page, URL) => {

    await page.waitForTimeout(10000);

    await func_continue(page);

    await func_relog(page, 'https://hwdsb.simplication.com/WLSBLogin.aspx');

    await page.goto(URL);

    let rows = await page.locator('//div[@id="job-list"]/div[1]/*'); // Array Rows

    if (Array.from(await rows.all()).length == 0){return}; //Guard Clause

    for (let row of await rows.all()) {

        // Variables String
        let sub = await row.locator('//a').evaluate(e=>e.innerHTML);
        let school = await row.locator('//div[2]/span[1]').evaluate(e=>e.innerText);
        let startNpay = await row.locator('//div[3]/span[1]').evaluate(e=>e.innerText);
        let splitStartNPay = startNpay.split(' ');
        let pay = splitStartNPay[splitStartNPay.length - 1].replace('(','').replace(')',''); 
    
        // Arrays Splits
        let array_school = school.split(' ').map(e=>e.toLowerCase());
        let array_sub = sub.split(' ').map(e=>e.toLowerCase());
        
        // Boolean Conditions
        let bool_school_1 = ARRAY_SCHOOLS_1.some(e=>array_school.includes(e.toLowerCase()));
        let bool_school_2 = ARRAY_SCHOOLS_2.some(e=>array_school.includes(e.toLowerCase()));
        let bool_school_3 = ARRAY_SCHOOLS_3.some(e=>array_school.includes(e.toLowerCase()));
        let bool_sub = LIST_SUBJECTS.some(e=>array_sub.includes(e.toLowerCase()));
        let bool_pay = pay.toLowerCase() == PAY.toLowerCase() ? true : false;

        // Nested Ternary Operators
        (bool_pay && "library".includes(sub.toLowerCase())) ? await func_audio(page,"sound_bing") : null;
        (bool_pay && bool_sub && bool_school_1) ? await func_audio(page,"sound_click") : null;
        (bool_pay && bool_sub && bool_school_2) ? await func_audio(page,"sound_tick") : null;
        (bool_pay && bool_sub && bool_school_3) ? await func_audio(page,"sound_shake") : null;
    };
};


const func_audio = async (page, str_option) => {
    
    if (str_option === "sound_bing") {
    
        await page.evaluate(`var sound_bing = new Audio("data:audio/wav; base64,${sounddata.soundString_bing}");`);
        await page.evaluate('sound_bing.play();');

    } else if (str_option === "sound_click") {
    
        await page.evaluate(`var sound_click = new Audio("data:audio/wav; base64,${sounddata.soundString_click}");`);
        await page.evaluate('sound_click.play();');

    } else if (str_option === "sound_tick") {

        await page.evaluate(`var sound_tick = new Audio("data:audio/wav; base64,${sounddata.soundString_tick}");`);
        await page.evaluate('sound_tick.play();');

    } else if (str_option === "sound_shake"){

        await page.evaluate(`var sound_shake = new Audio("data:audio/wav; base64,${sounddata.soundString_shake}");`);
        await page.evaluate('sound_shake.play();');
    };
};


const func_continue = async (page) => {
    
    let cont = await page.locator('//button');
        
    for (let con of await cont.all()) {

        if (con.evaluate(e=>e.innerText.toLowerCase()) == "continue") {
            
            con.click();
            
            console.log('[\x1b[32m✔\x1b[0m] func_continue()');
        }; 
    };
};


const func_relog = async (page, url_page) => {

    let url_current = await page.url();

    if (url_current == url_page) {

        await func_auth(page, url_page);

        console.log('[\x1b[32m✔\x1b[0m] func_func_relog()');
    };
};