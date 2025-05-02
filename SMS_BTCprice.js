function func_sendSMS (email, sub, msg) {
    const URL ='<GOOGLE-APP-SCRIPT-LINK>';
    let data = {'Email': email, 'Subject':sub, 'Message': msg};
    let dataJson = JSON.stringify(data);
    let headers = {'Content-Type':'application/json', 'Accept':'application/json'};
    let opt = {method:'POST', headers:headers, body: dataJson};
    fetch(URL, opt);
};

fetch('https://www.google.com/finance/quote/BTC-CAD')
.then(r=>r.text())
.then(r=> {
    const stringEnd = '</div></div></span></div></div><div jsname=';
    const stringStart = '<div class=".*">';
    const pattern = '[0-9,]*\.[0-9]{2}';
    const obj_matchBTC = r.match(`(?<=${stringStart})${pattern}(?=${stringEnd})`);
    const num_matchBTC = Number(String(obj_matchBTC).replace(',',''));
    
    if (num_matchBTC < 100000) func_sendSMS('<PHONE-EMAIL>','BTC Drop', num_matchBTC);
    if (num_matchBTC > 150000) func_sendSMS('<PHONE-EMAIL>','BTC High', num_matchBTC);
});
