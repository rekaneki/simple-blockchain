const SHA256 = require("crypto-js/sha256");

class Block {
    constructor(index, timestamp, transactions, prevHash = "") {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.prevHash = prevHash;
        this.hash = "";
        this.nonce = 0;
    }

    calcHash() {
        return SHA256(
            this.index +
                this.prevHash +
                this.timestamp +
                JSON.stringify(this.transactions) +
                this.nonce,
        ).toString();
    }

    mineBlock(diff) {
        while (this.hash.substring(0, diff) !== Array(diff + 1).join("0")) {
            this.nonce++;
            this.hash = this.calcHash();
        }
    }

    validateTransactions() {
        for (const tx of this.transactions) {
            if (!tx.isValid()) {
                return false;
            }
        }

        return true;
    }
}

module.exports = Block;