const { chromium } = require('playwright');
const sounddata = require('./soundaudio.json');

const ARRAY_SUBJECTS = ['math', 'science', 'library', 'geography', 'physics', 'chemistry', 'biology', 'career'];
const ARRAY_SCHOOLS_1 = ["glendale", "winston", "bernie","cathedral", "newman"];
const ARRAY_SCHOOLS_2 = ["henderson", "westdale", "westmount" ,"sherwood","brebeuf"];
const ARRAY_SCHOOLS_3 = ["saltfleet", "orchard"];

const STATUS = 'open';
const PAY = '100%';
const DELAY = 10000;

// Main Function

(async () => {
    
    const browser1 = await chromium.launch({headless:false, args: ["--window-position=0,0"]});
    const browser2 = await chromium.launch({headless:false, args: ["--window-position=650,0"]});

    const context1 = await browser1.newContext({viewport: {width: 650, height: 600}});
    const context2 = await browser2.newContext({viewport: {width: 650, height: 600}});
    
    const openPage1 = await context1.newPage();
    const openPage2 = await context2.newPage();
 
    openPage1.setDefaultTimeout(300000);
    openPage2.setDefaultTimeout(300000);

    let page_c = await func_auth(openPage1, 'https://hwcdsb.simplication.com/WLSBLogin.aspx');
    let page_p = await func_auth(openPage2, 'https://hwdsb.simplication.com/WLSBLogin.aspx');  
    
    while (true) {
        
        await func_assignOffer(page_c, 'https://hwcdsb.simplication.com/Applicant/AttOccasionalPostings.aspx?TAB=PA');
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

    console.log(func_colorStr('[✔] func_auth ' + URL.slice(0,15)));

    return page;
};


const func_assignOffer = async (page, URL) => {

    await func_continue(page);
        
    await func_relog(page, 'https://hwcdsb.simplication.com/WLSBLogin.aspx');

    await page.goto(URL);

    await page.locator('//input[@id="ctl00_ContentPlaceHolder1_chkOpenPostingsOnly"]').click();
    
    await page.waitForTimeout(1000);

    await page.mouse.wheel(0, 100);
    
    await page.waitForTimeout(DELAY);

    let rows = await page.locator('//a[@class="AbsenceEx"]/parent::td/parent::tr'); // Array Rows
        
    if(Array.from(await rows.all()).length == 0){console.log(func_colorStr('[-] Guard Clause: assignOffer')); return};

    console.log('--- Catholic Board ---');

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
            
        // Ternary Operators
        (bool_status && bool_pay && "library".includes(sub.toLowerCase())) ? await func_audio(page,"sound_bing") : null;
        (bool_status && bool_pay && bool_sub && bool_school_1) ? await func_audio(page,"sound_click") : null;
        (bool_status && bool_pay && bool_sub && bool_school_2) ? await func_audio(page,"sound_tick") : null;
        (bool_status && bool_pay && bool_sub && bool_school_3) ? await func_audio(page,"sound_shake") : null;

        console.log(func_colorStr(`[*] Pay:${pay}[${bool_pay}], Sub:${sub}[${bool_sub}], School:${school.slice(0,10)}, Status:${status}[${bool_status}]`));
    };
};


const func_jobBoard = async (page, URL) => {

    await func_continue(page);

    await func_relog(page, 'https://hwdsb.simplication.com/WLSBLogin.aspx');

    await page.goto(URL);

    await page.waitForTimeout(1000);

    await page.mouse.wheel(0, 100);

    await page.waitForTimeout(DELAY);

    let rows = await page.locator('//h4/a/parent::h4/parent::div'); // Array Rows
   
    if (Array.from(await rows.all()).length == 0) {console.log(func_colorStr('[-] Guard Clause: jobBoard')); return};

    console.log('--- Public Board ---');

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
        let bool_school = [...ARRAY_SCHOOLS_1, ...ARRAY_SCHOOLS_2, ...ARRAY_SCHOOLS_3].some(e=>array_school.includes(e.toLowerCase()));
        let bool_sub = ARRAY_SUBJECTS.some(e=>array_sub.includes(e.toLowerCase()));
        let bool_pay = pay.toLowerCase() == PAY.toLowerCase() ? true : false;

        // Ternary Operators
        (bool_pay && "library".includes(sub.toLowerCase())) ? await func_audio(page,"sound_bing") : null;
        (bool_pay && bool_sub && bool_school_1) ? await func_audio(page,"sound_click") : null;
        (bool_pay && bool_sub && bool_school_2) ? await func_audio(page,"sound_tick") : null;
        (bool_pay && bool_sub && bool_school_3) ? await func_audio(page,"sound_shake") : null;
            
        console.log(func_colorStr(`[*] Pay:${pay}[${bool_pay}], Sub:${sub}[${bool_sub}], School:${school.slice(0,10)}:[${bool_school}]`));
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
            
            console.log(func_colorStr('[!] func_continue()'));
        }; 
    };
};


const func_relog = async (page, url_page) => {

    let url_current = await page.url();

    if (url_current == url_page) {

        await func_auth(page, url_page);

        console.log(func_colorStr('[!] func_func_relog()'));
    };
};


const func_colorStr = (statement) => {
    let mod_statement = statement
        .replaceAll('*', '\x1b[34m*\x1b[0m') // blue
        .replaceAll('true', '\x1b[32mtrue\x1b[0m') // green
        .replaceAll('false', '\x1b[31mfalse\x1b[0m') // red
        .replaceAll('✔', '\x1b[32m✔\x1b[0m') // green
        .replaceAll('-', '\x1b[31m-\x1b[0m') // red
        .replaceAll('!', '\x1b[33m!\x1b[0m') // yellow
        .replaceAll('Pay','\x1b[106mPay\x1b[0m') // bg yellow
        .replaceAll('Sub','\x1b[106mSub\x1b[0m') // bg yellow
        .replaceAll('School','\x1b[106mSchool\x1b[0m') // bg yellow
    return mod_statement;
};
