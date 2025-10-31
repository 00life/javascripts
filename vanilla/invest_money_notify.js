const TRADERS = {Pelosi:'P000197',Romney:'R000615',Warner:'W000805',McConnel:'M000355',Gottheimer:'G000583',Tuberville:'T000278',Goldman:'G000599', Wasserman:'W000797', Wyden:'W000779',Collins:'C001035'};
const STOCKS_NASDAQ = ['NVDA','TSLA', 'AMZN', 'GOOGL','TEM', 'PANW','AVGO','MSFT','PLTR', 'MATW','INTC','AAPL'];
const STOCKS_NYSE = ['VST', 'BN','TJX','WFC'];
const TOP_INTEREST = 5;
const URL ='<GOOGLE_APPS_SCRIPT_URL>';


async function func_followTraders(trader){
    let url = `https://www.capitoltrades.com/politicians/${trader}`;
    let page = await fetch(url);
    let pageText = await page.text();

    let lookB = '(?<=q-field issuer-ticker\">)';
    let lookA = '(?=q-field tx-type tx-type--buy has-asterisk)';
    let stockMatch = pageText.matchAll(lookB + '.*?' + lookA);
    
    let set_stocks = new Set();

    let count = 0;
    let count2 = 0
    
    for(const stock of stockMatch){
        count2++;
        if(count >= 10 || count2 >=20) break;
        let stock_code = stock[0].match('^.*?(?=:)')[0];
        if(stock_code.includes('N/A')) continue;
        set_stocks.add(stock_code);
        count++;
    };
    
    let array_stocks = Array.from(set_stocks);
    return array_stocks
};

async function func_poliFreqStock(){
    let arr_traderCodes = Object.values(TRADERS);

    let allStocks = arr_traderCodes.map(async r => {
        let arr_stocks = [];
        let arr_traderStocks = await func_followTraders(r);
        arr_traderStocks.forEach(r => arr_stocks.push(r));
        return arr_stocks;
    });

    let result = await Promise.all([...allStocks]);
    let stock_list = [];
    let stock_set = new Set();

    for(let stocks of result){
        stocks.forEach(s=>{
            stock_list.push(s);
            stock_set.add(s);
        });
    };

    let freq_stock = {};
    let totalStockCount = stock_list.length;

    Array.from(stock_set).forEach(stockInterest => {
        let stockCount = stock_list.reduce((acc,s)=>stockInterest === s ? acc + 1 : acc , 0);
        freq_stock[stockInterest] = (stockCount / totalStockCount * 100).toFixed(0);
    });

    return Object.entries(freq_stock)
        .sort((a,b) => b[1] - a[1])
        .slice(0,TOP_INTEREST)
        .reduce((acc,item)=>({...acc, [item[0]] : item[1]}), {})
};

function func_lookupStock(stock, platform){
    return new Promise( (res,rej) => {
        let url = `https://www.google.com/finance/quote/${stock}:${platform}`;

        fetch(url)
        .then(r=>r.text())
        .then(r=>{
            let lookB = '(?<=data-last-price=\")';
            let lookA = '(?=\" data-last-normal-market-timestamp)';
            let priceMatch = r.match(lookB + '.*?' + lookA)[0];
            let priceMatchFix2 = Number(priceMatch).toFixed(0);
        
            let matchString = `[${stock} $${priceMatchFix2}]`;
            res(matchString)
        }).catch(error=>rej(error));
    })
};

async function func_lookupBTC(){
    let url = 'https://www.google.com/finance/quote/BTC-CAD';
    let page = await fetch(url);
    let pageText = await page.text();

    let lookB = '(?<=data-last-price=\")';
    let lookA = '(?=\" data-last-normal-market-timestamp)';
    let pageMatch = pageText.match(lookB + '.*?' + lookA)[0];
    let matchFix2 = Number(pageMatch).toFixed(0);

    let matchString = `[BTC $${matchFix2}]`;
    return matchString
};

async function func_StockString(){
    let arrayPromise1 =  STOCKS_NASDAQ.map(stock=>func_lookupStock(stock,'NASDAQ'));
    let arrayPromise2 =  STOCKS_NYSE.map(stock=>func_lookupStock(stock,'NYSE'));
    let btcPromise = func_lookupBTC();
    let arr_stock = await Promise.all([...arrayPromise1, ...arrayPromise2, btcPromise ]);
    let str_stock = arr_stock.join('\n');
    return str_stock
};

async function func_combineData(){
    let str_interestStocks = await func_StockString();
    let poli_freq = await func_poliFreqStock();
    return (str_interestStocks + '\nƒ'+JSON.stringify(poli_freq))
};

function func_sendMail (email, sub, msg) {
    let data = {'Email': email, 'Subject':sub, 'Message': msg};
    let dataJson = JSON.stringify(data);
    let headers = {'Content-Type':'application/json', 'Accept':'application/json'};
    let opt = {method:'POST', headers:headers, body: dataJson};
    fetch(URL, opt);
};

// Main Function
(async ()=>{
    let sms = await func_combineData();
    func_sendMail('<EMAIL_ADDRESS>','', sms);
})();


//---------------------------------------------------
//---Run the script from Github---
//---------------------------------------------------
//const APP_URL ='';
//const EMAIL = '';

//// Main Function
//(async ()=>{
//    let response = await fetch('https://raw.githubusercontent.com/00life/javascripts/refs/heads/master/invest_money_notify.js');
//    let str_code = await response.text();
//    let update_code = str_code
//                        .replace('<GOOGLE_APPS_SCRIPT_URL>', APP_URL)
//                        .replace('<EMAIL_ADDRESS>', EMAIL)
//    eval(update_code)
//})();
