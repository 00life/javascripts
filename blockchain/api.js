const { join } = require('path');
const { func_01_fetchPOST } = require(join(__dirname, 'exports_01'));

// Create a bitcoin blockchain object
const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

// Create an api express object and configure
const express = require('express');
const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({extended: true}));
app.use(express.static(join(__dirname, 'block-explorer')));


// ENDPOINT to see the status of the blockchain
app.get('/blockchain', function(req, res) {res.send(bitcoin)});


// ENDPOINT to create a pending transaction
app.post('/transaction', function(req, res) {
    const newTransaction = req.body;
    const blockIndex = bitcoin.addTransactionToPendingTransaction(newTransaction);
    res.json({note: `Transaction will be added in block ${blockIndex}.`});
});


// ENDPOINT to create a transaction and broadcast it to the network nodes
app.post('/transaction/broadcast', function(req, res) {
    var { amount, sender, recipient } = req.body;
    const newTransaction = bitcoin.createNewTransaction(amount, sender, recipient);
    bitcoin.addTransactionToPendingTransaction(newTransaction);
    const requestPromises = [];

    // Fill the requestPromises array with fetch post requests
    bitcoin.networkNodes.forEach(url => {
        let fetchPOST = func_01_fetchPOST(`${url}/transaction`, newTransaction);
        requestPromises.push(fetchPOST);
    });

    // Process all the fetch post requests from the requestPromises array
    Promise.all(requestPromises)
    .then(() => res.json({note: 'Transaction created and broadcast successfully'}))
});


// ENDPOINT add pending transaction to transaction array
app.get('/mine', function(req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];

    // Collect pending transactions to be used for the nonce and hash
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    };

    // Create a new block and add it to the chain
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
    
    // Addition data to be used below
    const requestPromises = [];
    const data = {newBlock: newBlock};
    const reward = {amount: 12.5, sender:'reward', recipient: bitcoin.currentNodeUrl};

    // Fill the requestPromises array with fetch post requests 
    bitcoin.networkNodes.forEach(url => {
        let fetchPOST = func_01_fetchPOST(`${url}/receive-new-block`, data);
        requestPromises.push(fetchPOST);
    });

    // Process all the fetch post requests from the requestPromises array
    Promise.all(requestPromises)
    .then(() => func_01_fetchPOST(`${bitcoin.currentNodeUrl}/transaction/broadcast`, reward)) // mine reward
    .then(() => res.json({note: 'New block mined and broadcast successfully', block: newBlock}))
});


// ENDPOINT receives a new block and check if it is legit
app.post('/receive-new-block', function(req, res) {
    const { newBlock } = req.body;
    const lastBlock = bitcoin.getLastBlock();
    const correctHash = (lastBlock['hash'] === newBlock['previousBlockHash']);
    const correctIndex = (lastBlock['index'] + 1 === newBlock['index']);

    // Accepting the newBlock into the chain
    if(correctHash && correctIndex) {
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions = [];
        res.json({note: 'New block received and accepted', newBlock: newBlock});
    
    // Rejecting the newBlock into the chain
    } else {
        res.json({note: 'New block rejected', newBlock: newBlock});
    };
});


// ENDPOINT receives a post request with data = {"newNodeUrl": "http://URL:PORT"}
app.post('/register-and-broadcast-node', function(req, res) {
    const { newNodeUrl } = req.body;
    const notAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
    
    (notAlreadyPresent && notCurrentNode) ? bitcoin.networkNodes.push(newNodeUrl) : null;
    
    let regNodePromises = []; // Keep a list of fetch request promises

    // Ensure all urls in the array are unique
    let set_allNetworkNodes = new Set([...bitcoin.networkNodes, bitcoin.currentNodeUrl])
    let arr_allNetworkNodes = [...set_allNetworkNodes];

    // Sending fetch to register the current node with all network nodes
    var data1 = {newNodeUrl: bitcoin.currentNodeUrl};
    
    bitcoin.networkNodes.forEach(url => {
        let fetchPOST = func_01_fetchPOST(`${url}/register-node`, data1);
        regNodePromises.push(fetchPOST);
    });

    // Sending fetch to register all network nodes with the new node
    var data2 = {allNetworkNodes: arr_allNetworkNodes};
    
    Promise.all(regNodePromises)
    .then(() => bitcoin.networkNodes.forEach(url => func_01_fetchPOST(`${url}/register-nodes-bulk`, data2)))
    .then(() => res.json({note: '/register-and-broadcast-node: New node registered successfully'}));   
});


// ENDPOINT to only register a single node {newNodeUrl: URL}
app.post('/register-node', function(req, res) {
    const { newNodeUrl } = req.body;
    const notAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;

    (notAlreadyPresent && notCurrentNode) ? bitcoin.networkNodes.push(newNodeUrl) : null;
    
    res.json({note: '/register-node: New node registered successfully'});
});


// ENDPOINT to register multiple nodes in an array {allNetworkNodes: [URL,URL...]}
app.post('/register-nodes-bulk', function(req, res) {
    const { allNetworkNodes } = req.body;

    allNetworkNodes.forEach(url => {
        const notAlreadyPresent = bitcoin.networkNodes.indexOf(url) == -1;
        const notCurrentNode = bitcoin.currentNodeUrl !== url;
        
        (notAlreadyPresent && notCurrentNode) ? bitcoin.networkNodes.push(url) : null;
    });
    res.json({note: '/register-nodes-bulk: New node registered successfully'});
});


// ENDPOINT to register multiple nodes in an array {allNetworkNodes: [URL,URL...]}
app.get('/consensus', function(req, res) {
    const currentChainLength = bitcoin.chain.length;
    let maxChainLength = currentChainLength; // initial value
    let newLongestChain = null; // initial value
    let newPendingTransactions = null; // initial value

    let requestPromises = bitcoin.networkNodes.map(async url => {
        let getFetch =  await fetch(url+'/blockchain');
        return getFetch.json()
    });

    Promise.all(requestPromises)
    .then(blockchains => blockchains.forEach(blockchain => {

        // Look for the longest chain
        if (blockchain['chain'].length > maxChainLength) {
            maxChainLength = blockchain['chain'].length;
            newLongestChain = blockchain['chain'];
            newPendingTransactions = blockchain['pendingTransactions'];
        };
    }))
    .then(() => {

        // Check if the longest chain is valid
        if (!newLongestChain || newLongestChain && !bitcoin.chainIsValid(newLongestChain)) {
            res.json({note: '/consensus: Current chain has not been replaced', chain: bitcoin.chain})

        } else {
            bitcoin.chain = newLongestChain;
            bitcoin.transactions = newPendingTransactions;
            res.json({note: '/consensus: This chain has been replaced', chain: bitcoin.chain});
        };
    });
});


// ENDPOINT to send a hash and return a specific block
app.get('/block/:blockHash', function(req, res) {
    const blockHash = req.params.blockHash;
    const correctBlock = bitcoin.getBlock(blockHash);
    res.json({block: correctBlock});
});


// ENDPOINT to send a transactionID and return a specific transaction
app.get('/transaction/:transactionID', function(req, res) {
    const transactionID = req.params.transactionID;
    const { transaction, block } = bitcoin.getTransaction(transactionID);
    res.json({transaction, block})
});


// ENDPOINT to send an address and return the transactions balance
app.get('/address/:address', function(req, res) {
    const address = req.params.address;
    const { addressTransactions, addressBalance } = bitcoin.getAddressData(address);
    res.json({addressTransactions, addressBalance})
});


app.get('/block-explorer', function(req, res) {
    res.sendFile(join(__dirname, 'block-explorer/index.html'));
});


app.get('/{*any}', function(req, res) {
    res.redirect('/block-explorer')
});


// Start the API on a specific port
const port = process.argv[2]; // Environment Variable
app.listen(port, () => console.log(`Listening on port ${port}...`));