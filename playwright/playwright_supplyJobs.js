const { chromium } = require('playwright');

const LIST_SUBJECTS = ['Math', 'Science', 'Library', 'Geography', 'Physics', 'Chemistry', 'Biology', 'Career'];
const LIST_SCHOOLS = ['Cathedral', 'Newman', 'Glendale', 'Winston', 'Bernie','Henderson', 'Westdale', 'Westmount' ,'Sherwood','Saltfleet', 'Orchard'];
const STATUS = 'open';
const PAY = '100%';


(async()=>{

    const browser = await chromium.launch({headless:true});
    
    let page_c = await func_auth(browser, 'https://hwcdsb.simplication.com/WLSBLogin.aspx');

    let page_p = await func_auth(browser, 'https://hwdsb.simplication.com/WLSBLogin.aspx');

    await func_assignOffer(page_c, 'https://hwcdsb.simplication.com/Applicant/AttOccasionalPostings.aspx?TAB=PA', 'Catholic Offer');
    
    await func_assignOffer(page_p, 'https://hwdsb.simplication.com/Applicant/AttOccasionalPostings.aspx?TAB=PA', 'Public Offer');

    await func_jobBoard(page_c, 'https://hwcdsb.simplication.com/Applicant/AttOccasionalJobBoard.aspx', 'Catholic Job Board');

    await func_jobBoard(page_p, 'https://hwdsb.simplication.com/Applicant/AttOccasionalJobBoard.aspx', 'Public Job Board');

    await browser.close();
})();


const func_auth = async (browser, URL) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    page.setDefaultTimeout(300000);

    await page.goto(URL);
    
    await page.locator('//input[@placeholder="Enter username or email"]').fill('USERNAME');
    
    await page.click('//input[@value="Next"]');
    
    await page.locator('//span[text()="Password"]/parent::*/following-sibling::*[1]').pressSequentially('PASSWORD', {delay:100});
    
    await page.locator('//input[@value="Sign In"]').click();

    console.log('[\x1b[32m✔\x1b[0m] func_auth ' + URL.slice(0,15));

    return page;
};


const func_assignOffer = async (page, URL, type) => {

    await page.goto(URL);

    await page.locator('//input[@id="ctl00_ContentPlaceHolder1_chkOpenPostingsOnly"]').click();

    let rows = await page.locator('//a[@class="AbsenceEx"]/parent::td/parent::tr');

    if(Array.from(await rows.all()).length == 0){
        console.log('[\x1b[32m✔\x1b[0m] func_assignOffer ' + type);
        return
    }; //Guard Clause

    for(let row of await rows.all()){

        let pay = await row.locator('//td[2]').evaluate(e=>e.innerText);
        let sub = await row.locator('//td[3]').evaluate(e=>e.innerText);
        let school = await row.locator('//td[4]').evaluate(e=>e.innerText.split('\n')[0]);
        let start = await row.locator('//td[5]').evaluate(e=>e.innerText.split(' ')[0]);
        let status = await row.locator('//td[7]').evaluate(e=>e.innerText);

        let array_school = school.split(' ').map(e=>e.toLowerCase());
        let bool_school = LIST_SCHOOLS.some(e=>array_school.includes(e.toLowerCase()));

        let array_sub = sub.split(' ').map(e=>e.toLowerCase());
        let bool_sub = LIST_SUBJECTS.some(e=>array_sub.includes(e.toLowerCase()));
        
        let bool_status = status.toLowerCase() == STATUS.toLowerCase() ? true : false;
        let bool_pay = pay.toLowerCase() == PAY.toLowerCase() ? true : false;
        
        if(bool_status && bool_pay && bool_sub && bool_school){
            
            let val = await func_acceptLibrary(row, page, array_sub);
            (val === 1) ? await func_email(type, sub, school, pay, start) : null;
        };  
    };

    console.log('[\x1b[32m✔\x1b[0m] func_assignOffer ' + type);
};


const func_jobBoard = async (page, URL, type) => {

    await page.goto(URL);

    await func_timeDelay();
    
    let rows = await page.locator('//div[@id="job-list"]/div[1]/*');
    
    if(Array.from(await rows.all()).length == 0){
        console.log('[\x1b[32m✔\x1b[0m] func_jobBoard ' + type);
        return
    }; //Guard Clause

    for(let row of await rows.all()){

        let sub = await row.locator('//a').evaluate(e=>e.innerHTML);
        let school = await row.locator('//div[2]/span[1]').evaluate(e=>e.innerText);
        let startNpay = await row.locator('//div[3]/span[1]').evaluate(e=>e.innerText);
        let splitStartNPay = startNpay.split(' ');
        let pay = splitStartNPay[splitStartNPay.length - 1].replace('(','').replace(')',''); 
        let start = `${splitStartNPay[1]} ${splitStartNPay[2]}`.replace(',','');
        
        let array_school = school.split(' ').map(e=>e.toLowerCase());
        let bool_school = LIST_SCHOOLS.some(e=>array_school.includes(e.toLowerCase()));

        let array_sub = sub.split(' ').map(e=>e.toLowerCase());
        let bool_sub = LIST_SUBJECTS.some(e=>array_sub.includes(e.toLowerCase()));

        let bool_pay = pay.toLowerCase() == PAY.toLowerCase() ? true : false;


        if(bool_pay && bool_sub && bool_school){

            let val = await func_acceptLibrary(row, page, array_sub);
            (val === 1) ? await func_email(type, sub, school, pay, start) : null;
        }; 
    };

    console.log('[\x1b[32m✔\x1b[0m] func_jobBoard ' + type); 
};


const func_email = async (type, sub, school, pay, start) => {

    let assign = `${type} // ${sub} // ${school} // ${pay} // ${start}`;
    let dataEmail = {'Email':'reza.s.tahirkheli@gmail.com', 'Subject':assign, 'Message':assign};
    let appScriptURL = 'https://script.google.com/macros/s/AKfycbzzVxX1O0UTSzHBe7UElCNwnVPZrU3GqE98pmrivrQajqqM8QEe477O6MEl8gbhimozCg/exec';
    
    fetch(appScriptURL,{method:'POST', body:JSON.stringify(dataEmail)});
}; 


const func_acceptLibrary = async (row, page, array_sub) => {

    if(array_sub.some(e=>e == 'library')){

        await row.locator('//a').click();

        await func_timeDelay();

        await page.locator('//input[@value="Accept"]').click();

        return 1

    } else {

        return 0
    }
};


const func_timeDelay = async (time=5000) => {

    await new Promise(resolve =>setTimeout(async()=>{await resolve()}, time));
};
