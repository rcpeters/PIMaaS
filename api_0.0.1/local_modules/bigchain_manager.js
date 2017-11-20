var mongojs = require('mongojs'),
  Ajv = require('ajv')


var BigchainManger = function(){
   this.API_PATH = 'http://localhost:9984/api/v1/';
   this.driver = require('bigchaindb-driver')  
}

BigchainManger.prototype.getEd25519Keypair = function() {
    return new this.driver.Ed25519Keypair();
}

BigchainManger.prototype.postTransaction = function(data, publicKey, privateKey, func) {
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
    console.log("start signing'")
    const txSigned = this.driver.Transaction.signTransaction(tx, privateKey)
    console.log("connect to db")
    const conn = new this.driver.Connection(this.API_PATH) // should this be pooled?
    console.log("post")    
    conn.postTransaction(txSigned)
            .then(() => conn.pollStatusAndFetchTransaction(txSigned.id))
        .then(
        function(retrievedTx) {
            func(retrievedTx);
    })
        

}

exports.BigchainManger = BigchainManger;
