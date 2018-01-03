var bigchainManger = require("./bigchain_manager.js"),
  Ajv = require('ajv')

// singleton https://team.goodeggs.com/export-this-interface-design-patterns-for-node-js-modules-b48a3b1f8f40
function PIMaasManger () {
   console.log("New PIMaasManger Instance")
}

PIMaasManger.prototype.getEd25519Keypair = function() {
    bigchainManger.getEd25519Keypair();
}

PIMaasManger.prototype.signTxAndPost = function(data, publicKey, privateKey, func) {
// Construct a transaction payload
    this.postTx(this.signTx(data, publicKey, privateKey), func);    
}

PIMaasManger.prototype.signTx = function(data, publicKey, privateKey) {
    return bigchainManger.signTx(data, publicKey, privateKey);
}

PIMaasManger.prototype.getSet = function(txId, func) {
    this.getTx(txId, function(tx) {func(tx.asset.data)})
}

PIMaasManger.prototype.getTx = function(txId, func) {
    bigchainManger.getTx(txId, func)
}

PIMaasManger.prototype.postTx = function(tx, func) {
    console.log("hereeeeeeeeeeeeeeeeeee")
    console.log(tx)
    bigchainManger.postTx(tx, func);
}

module.exports = exports = new PIMaasManger();
