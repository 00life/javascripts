const { createHash } = require('crypto');
const fs = require('fs');
const { v1:uuid } = require('uuid');

const DIFFICULTY = 4; // How easily to find a nounce
const currentNodeUrl = process.argv[3]; // Gets the env variable

// Main OBJECT
function Blockchain() {
    this.chain = [];
    this.pendingTransactions = [];
    this.networkNodes = [];
    this.currentNodeUrl = currentNodeUrl;

    // Hashing the contents of blockchain.js
    var fileContents = fs.readFileSync('./blockchain.js','utf8');
    this.hashJSCode = createHash('sha256').update(fileContents).digest('hex');
    
    // First block (i.e. genesisBlock): createNewBlock(nonce, previousHash, currentHash)
    this.createNewBlock('0', 'Genesis', this.hashJSCode);
};


// METHOD to create a ne block
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
    const newBlock = {
        index : this.chain.length + 1,
        timestamp : Date.now(),
        transactions : this.pendingTransactions,
        nonce : nonce,
        hash : hash,
        previousBlockHash : previousBlockHash
    };

    this.chain.push(newBlock);  // Add newBlock to the chain
    this.pendingTransactions = [];  // Clear transactions

    return newBlock;
};


// METHOD to get the last block of the chain array
Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1];
};


// METHOD to create a new transaction
Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
    const newTransaction = {
        amount : amount,
        sender : sender,
        recipient : recipient,
        transactionID: uuid().replaceAll('-','') // uuid timestamp
    };

    return newTransaction;
};


// METHOD to add a transaction to the pendingTransaction array
Blockchain.prototype.addTransactionToPendingTransaction = function(transactionObj) {
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()['index'] + 1
};


// METHOD to creates the Hash of the blockchain 
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + String(nonce) + JSON.stringify(currentBlockData);
    const hash = createHash('sha256').update(dataAsString).digest('hex');
    return hash;
};


// METHOD to returns the correct nonce that produces a hash with ^0000... 
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
    let nonce = 0; // Counter to the while loop
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

    while (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY)) {
        nonce++; // Increment the nonce by 1
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    };

    return nonce
};

// METHOD to check the blockchains validity
Blockchain.prototype.chainIsValid = function(blockchain) {
    
    let validChain = true;

    // Loop excluding the first block (i.e. genesisBlock)
    for (let i = 1; i < blockchain.length; i++) {

        const currentBlock = blockchain[i];
        const prevBlock = blockchain[i - 1];

        const prevBlockHash = prevBlock['hash'];
        const currPrevBlockHash = currentBlock['previousBlockHash'];
        const currBlockData = {transactions: currentBlock['transactions'], index: currentBlock['index']};
        const nonce = currentBlock['nonce'];

        const blockHash = this.hashBlock(prevBlockHash, currBlockData, nonce);

        // Checking if the hashes between the current and previous block
        if (currPrevBlockHash !== prevBlockHash) validChain = false;

        // Checking if the hash start with correct amount of zeros
        if (blockHash.substring(0,DIFFICULTY) !== '0'.repeat(DIFFICULTY)) validChain = false;
    };

    // Gensis block data
    const genesisBlock = blockchain[0];
    const correctGenesisNonce = genesisBlock['nonce'] === '0';
    const correctGenesisPrevBlockHash = genesisBlock['previousBlockHash'] === 'Genesis';
    const correctGenesisHash = genesisBlock['hash'] == this.hashJSCode; // change for production
    const correctGenesisTransactions = genesisBlock['transactions'].length === 0;

    // Checking if the genesis block is valid
    if (!correctGenesisNonce || !correctGenesisPrevBlockHash || !correctGenesisHash || !correctGenesisTransactions) validChain = false;
    
    return validChain
};


Blockchain.prototype.getBlock = function(blockHash) {
    let correctBlock = null;
    this.chain.forEach(block => (block['hash'] === blockHash) ? correctBlock = block : null);
    return correctBlock
};


Blockchain.prototype.getTransaction = function(transactionID) {
    let correctTransaction = null;
    let correctBlock = null;

    this.chain.forEach(block => {
        block['transactions'].forEach(transaction => {
            if (transaction['transactionID'] === transactionID) {
                correctTransaction = transaction;
                correctBlock = block;
            };
        });
    });
    return {transaction: correctTransaction, block: correctBlock}
};


Blockchain.prototype.getAddressData = function(address) {
    const addressTransactions = [];

    this.chain.forEach(block => {
        block['transactions'].forEach(transaction => {
            if (transaction['sender'] === address || transaction['recipient'] === address) {
                addressTransactions.push(transaction);
            };
        });
    });

    let balance = 0;
    addressTransactions.forEach(transaction => {
        if (transaction['recipient'] === address) balance += transaction['amount'];
        else if (transaction['sender'] === address) balance -= transaction['amount'];
    });

    return {addressTransactions: addressTransactions, addressBalance: balance}
};


module.exports = Blockchain;
