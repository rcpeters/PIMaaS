var mongojs = require('mongojs')

// singleton https://team.goodeggs.com/export-this-interface-design-patterns-for-node-js-modules-b48a3b1f8f40
function BigchainManger () {
   console.log("New BigchainManger Instance")
   this.API_PATH = 'http://localhost:9984/api/v1/';
   this.driver = require('bigchaindb-driver')  
}

BigchainManger.prototype.getEd25519Keypair = function() {
    return new this.driver.Ed25519Keypair();
}

BigchainManger.prototype.signTxAndPost = function(data, publicKey, privateKey, func) {
// Construct a transaction payload
    this.postTx(this.signTx(data, publicKey, privateKey), func);    
}

BigchainManger.prototype.signTx = function(data, publicKey, privateKey) {
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
    return this.driver.Transaction.signTransaction(tx, privateKey)    
}

BigchainManger.prototype.getTx = function(txId, func) {
    const conn = new this.driver.Connection(this.API_PATH) // should this be pooled?
        conn.getTransaction(txId).then(
                function(retrievedTx) {
            console.log('Transaction', retrievedTx, 'fetched ')
            console.log(retrievedTx.asset);
            func(retrievedTx.asset.data)
        })
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
