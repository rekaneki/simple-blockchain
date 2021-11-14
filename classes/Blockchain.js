const Block = require("./Block");
const Transaction = require("./Transaction");

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.diff = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        let genesis = new Block(
            0,
            getCurrentTimestamp(),
            { value: "genesis" },
            "0",
        );
        genesis.hash = "0";

        return genesis;
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(privateKey, miningRewardAddress) {
        const latestBlock = this.getLatestBlock();

        let newBlock = new Block(
            latestBlock.index + 1,
            getCurrentTimestamp(),
            this.pendingTransactions,
            latestBlock.hash,
        );
        newBlock.mineBlock(this.diff);

        this.chain.push(newBlock);

        this.pendingTransactions = [];
        this.createTransaction(
            privateKey,
            null,
            miningRewardAddress,
            this.miningReward,
            true,
        );
    }

    createTransaction(
        privateKey,
        fromAddress,
        toAddress,
        amount,
        isSystem = false,
    ) {
        if ((!fromAddress || !toAddress) && !isSystem) {
            throw new Error(
                "Transactions must include sending and receiving address!",
            );
        }

        const tx = new Transaction(fromAddress, toAddress, amount, isSystem);
        tx.signTransaction(privateKey);

        this.pendingTransactions.push(tx);
    }

    getBalanceOfAddress(address) {
        let balance = 0;
        let pendingBalance = 0;

        this.chain.forEach((block) => {
            for (let i = 0; i < block.transactions.length; i++) {
                if (block.transactions[i].fromAddress === address) {
                    balance -= block.transactions[i].amount;
                }

                if (block.transactions[i].toAddress === address) {
                    balance += block.transactions[i].amount;
                }
            }
        });

        for (const pendingTx of this.pendingTransactions) {
            if (pendingTx.fromAddress === address) {
                pendingBalance -= pendingTx.amount;
            }

            if (pendingTx.toAddress === address) {
                pendingBalance += pendingTx.amount;
            }
        }

        return [balance, pendingBalance];
    }

    validateChain() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];

            if (!currentBlock.validateTransactions()) return false;

            if (currentBlock.hash !== currentBlock.calcHash()) return false;

            if (currentBlock.prevHash !== prevBlock.calcHash() && i !== 1)
                return false;
        }

        return true;
    }
}

getCurrentTimestamp = () => {
    let currentdate = new Date();
    let datetime =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        "-" +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();

    return datetime;
};

module.exports = Blockchain;
