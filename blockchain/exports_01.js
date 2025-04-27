// Functon for Fetch POST request
function func_01_fetchPOST(url, data) {
    var headers = {"Content-Type": "application/json", "Accept": "application/json"};
    var opt = {method: 'POST', headers: headers, body: JSON.stringify(data)};
    return fetch(url, opt);
};


// Functions to export
module.exports = {
    func_01_fetchPOST
};