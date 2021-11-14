const Blockchain = require("./classes/Blockchain");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

let xchain = new Blockchain();

// Wallet
const privateKey =
    "c20fe52b052d68de11f8e64a4baa568e61f6504a7381102000f28f2eb75a9ba1";
const walletAddr = ec
    .keyFromPrivate(
        "c20fe52b052d68de11f8e64a4baa568e61f6504a7381102000f28f2eb75a9ba1",
    )
    .getPublic("hex");

// Block #1
xchain.createTransaction(privateKey, walletAddr, "toAddress1", 10);
xchain.createTransaction(privateKey, walletAddr, "toAddress2", 10);

// Mining block #1
xchain.minePendingTransactions(privateKey, walletAddr);

xchain.createTransaction(privateKey, walletAddr, "toAddress1", 10);
xchain.createTransaction(privateKey, walletAddr, "toAddress2", 10);

// Mining block #2
xchain.minePendingTransactions(privateKey, walletAddr);

console.log(JSON.stringify(xchain, null, 4));

console.log("\nValid chain? ", xchain.validateChain(), "\n");

balance = xchain.getBalanceOfAddress(walletAddr);
console.log(`\nBalance for "${walletAddr}"`);
console.log(`Available: ${balance[0]}`);
console.log(`Pending: ${balance[1]}`);
