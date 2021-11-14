const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class Transaction {
    constructor(fromAddress, toAddress, amount, isSystem = false) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.isSystem = isSystem;
    }

    calcHash() {
        return SHA256(
            this.fromAddress + this.toAddress + this.amount,
        ).toString();
    }

    signTransaction(privateKey) {
        const key = ec.keyFromPrivate(privateKey);

        if (this.isSystem) return;
        if (key.getPublic("hex") !== this.fromAddress) {
            throw new Error("Cannot sign transactions of other wallets!");
        }

        const hashTx = this.calcHash();
        const sig = key.sign(hashTx, "base64");
        this.signature = sig.toDER("hex");
    }

    isValid() {
        if (this.isSystem && this.fromAddress === null) {
            return true;
        }

        if (!this.signature || this.signature === 0) {
            throw new Error("The transaction is not signed!");
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, "hex");

        return publicKey.verify(this.calcHash(), this.signature);
    }
}

module.exports = Transaction;
