var bigchainManger = require("./bigchain_manager.js"),
  Ajv = require('ajv')

var ajv = new Ajv();

var setSchema = {
  //"$schema": "http://json-schema.org/draft-06/schema#",
  "title": "Set setSchema",
  "type": "object",
  "properties": {
    "name": {
      "description": "name",
      "type": "string"
    },
    "schema": {
      "description": "schema",
      "type": "object"
    }
  },
  "required": ["schema", "name"],
  "additionalProperties": false
};

// singleton https://team.goodeggs.com/export-this-interface-design-patterns-for-node-js-modules-b48a3b1f8f40
function PIMaasManger () {
   console.log("New PIMaasManger Instance")
}

PIMaasManger.prototype.getEd25519Keypair = function() {
    bigchainManger.getEd25519Keypair();
}

PIMaasManger.prototype.signTxAndPost = function(data, publicKey, privateKey) {
    pimaasManger = this
    return new Promise(function (resolve, reject) {
        pimaasManger.signTx(data, publicKey, privateKey).then(function(signed) {
           pimaasManger.postTx(signed).then(function(tx){
              resolve(tx)
           });    
        }).catch(function(err) {
            reject(err);
        })
    }).catch(function(err) {
        reject(err);
    })
}

PIMaasManger.prototype.signTx = function(data, publicKey, privateKey) {
    var txMeta = {};
    var pimaasManger = this
    return new Promise(function (resolve, reject) {
        txMeta.isSet = ajv.validate(setSchema, data);
        if (txMeta.isSet == true) {
            txMeta.setName = data.name;
            resolve(bigchainManger.signTx(data, txMeta, publicKey, privateKey))
        }
        else {
            console.log(data);
            txMeta.schemaId = data.schemaId;
            pimaasManger.getSet(data.schemaId).then(function(pimSet) {
                console.log(ajv.validate(pimSet.schema,data.metadata))
                txMeta.setName = pimSet.name           
                if (ajv.validate(pimSet.schema,data.metadata))
                    resolve(bigchainManger.signTx(data, txMeta, publicKey, privateKey))
                else
                    reject(new Error("Doesn't validate"))
            }).catch(function(err) {
                reject(err);
            })
        }
    })
}

PIMaasManger.prototype.getSet = function(txId) {
  return new Promise(function (resolve, reject) {
      bigchainManger.getTx(txId).then(
        function(retrievedTx) {
          resolve(retrievedTx.asset.data)
      }).catch(function(err) {
        reject(err);
    })
  })
}

PIMaasManger.prototype.getTx = function(tx) {
  return new Promise(function (resolve, reject) {
      bigchainManger.getTx(tx).then(
        function(retrievedTx) {
          resolve(retrievedTx)
      }).catch(function(err) {
        reject(err);
    })
  })
}

PIMaasManger.prototype.postTx = function(tx) {
    return new Promise(function (resolve, reject) {
        bigchainManger.postTx(tx).then(resolve(tx))
    }).catch(function(err) {
        reject(err);
    })    
}

module.exports = exports = new PIMaasManger();