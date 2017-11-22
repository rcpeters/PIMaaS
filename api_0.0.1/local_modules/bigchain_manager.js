var mongojs = require('mongojs'),
  Ajv = require('ajv')

// singleton https://team.goodeggs.com/export-this-interface-design-patterns-for-node-js-modules-b48a3b1f8f40
function BigchainManger () {
   console.log("New BigchainManger Instance")
   this.API_PATH = 'http://localhost:9984/api/v1/';
   this.driver = require('bigchaindb-driver')  
}

BigchainManger.prototype.getEd25519Keypair = function() {
    return new this.driver.Ed25519Keypair();
}

BigchainManger.prototype.postAndSignTx = function(data, publicKey, privateKey, func) {
// Construct a transaction payload
    var tx = this.driver.Transaction.makeCreateTransaction(
        data,
           // Metadata contains information about the transaction itself
        // (can be `null` if not needed)
        null, 
        // A transaction needs an output
        [ this.driver.Transaction.makeOutput(
            this.driver.Transaction.makeEd25519Condition(publicKey))
        ],
        publicKey
    )
    const txSigned = this.driver.Transaction.signTransaction(tx, privateKey)
    this.postTx(txSigned, func);    
}

BigchainManger.prototype.postTx = function(tx, func) {
    const conn = new this.driver.Connection(this.API_PATH) // should this be pooled?
    conn.postTransaction(tx)
            .then(() => conn.pollStatusAndFetchTransaction(tx.id))
        .then(
        function(retrievedTx) {
            func(retrievedTx);
    })    
}

module.exports = exports = new BigchainManger();
