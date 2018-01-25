const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const mongoUrl = 'mongodb://localhost:27017/';


// singleton https://team.goodeggs.com/export-this-interface-design-patterns-for-node-js-modules-b48a3b1f8f40
function BigchainManger () {
   console.log("New BigchainManger Instance")
   this.API_PATH = 'http://localhost:9984/api/v1/'
   this.driver = require('bigchaindb-driver')

}

BigchainManger.prototype.getEd25519Keypair = function() {
    return new this.driver.Ed25519Keypair();
}

BigchainManger.prototype.signTxAndPost = function(data, publicKey, privateKey) {
// Construct a transaction payload
    var bigchainManger = this;
    return new Promise(function (resolve, reject) {  
        bigchainManger.postTx.then(
            resolve(this.signTx(data, publicKey, privateKey))
        ).catch(function (err) {
            reject(err); 
        })
    })
}

BigchainManger.prototype.signTx = function(data, metadata, publicKey, privateKey) {
    var tx = this.driver.Transaction.makeCreateTransaction(
        data,
           // Metadata contains information about the transaction itself
        // (can be `null` if not needed)
        metadata, 
        // A transaction needs an output
        [ this.driver.Transaction.makeOutput(
            this.driver.Transaction.makeEd25519Condition(publicKey))
        ],
        publicKey
    )
    return this.driver.Transaction.signTransaction(tx, privateKey)    
}

BigchainManger.prototype.getDeprecate = function(txId) { 
    return new Promise(function (resolve, reject) {
        MongoClient.connect(mongoUrl, function(err, client) {
          if (err) throw err
          var db = client.db('bigchain')
          console.log(db)
          const assets = db.collection('assets');
          assets.findOne({ 'data.deprecateId': txId } , function (err, docs) {
            resolve(docs)
          })
        })
    })
}

BigchainManger.prototype.getDead = function(txId) { 
    return new Promise(function (resolve, reject) {
        MongoClient.connect(mongoUrl, function(err, client) {
          if (err) throw err
          var db = client.db('bigchain')
          console.log(db)
          const assets = db.collection('assets');
          assets.findOne({ 'data.deadId': txId } , function (err, docs) {
            resolve(docs)
          })
        })
    })
}

BigchainManger.prototype.getTx = function(txId) {
    const conn = new this.driver.Connection(this.API_PATH) // should this be pooled?
    return new Promise(function (resolve, reject) {  
        conn.getTransaction(txId).then(
                function(retrievedTx) {
            resolve(retrievedTx)
        }).catch(function (err) {
            reject(err); 
        })
    })
}

BigchainManger.prototype.postTx = function(tx) {
    const conn = new this.driver.Connection(this.API_PATH) // should this be pooled?
    return new Promise(function (resolve, reject) { 
        conn.postTransaction(tx)
            .then(() => conn.pollStatusAndFetchTransaction(tx.id))
            .then(function(retrievedTx) {
                resolve(retrievedTx);
        }).catch(function(err) {
          reject(err);
        })
    })    
}

module.exports = exports = new BigchainManger();
