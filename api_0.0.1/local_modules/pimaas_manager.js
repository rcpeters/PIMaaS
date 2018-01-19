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

PIMaasManger.prototype.signTxAndPost = function(data, publicKey, privateKey, func) {
    pimaasManger = this
    pimaasManger.signTx(data, publicKey, privateKey, function(signed) {
       pimaasManger.postTx(signed, func);    
    })
}

PIMaasManger.prototype.signTx = function(data, publicKey, privateKey, func) {
    var txMeta = {};
    var pimaasManger = this
    txMeta.isSet = ajv.validate(setSchema, data);
    if (txMeta.isSet == true) {
        txMeta.setName = data.name;
        func(bigchainManger.signTx(data, txMeta, publicKey, privateKey));
    }
    else {
        console.log(data);
        txMeta.schemaId = data.schemaId;
        pimaasManger.getSet(data.schemaId).then(function(pimSet) {
            console.log(ajv.validate(pimSet.schema,data.metadata))
            txMeta.setName = pimSet.name           
            if (ajv.validate(pimSet.schema,data.metadata))
                func(bigchainManger.signTx(data, txMeta, publicKey, privateKey));
            else
                throw new Error("Doesn't validate");
        })
    }    
}

PIMaasManger.prototype.getSet = function(txId, func) {
  return new Promise(function (resolve, reject) {
      bigchainManger.getTx(txId).then(
        function(retrievedTx) {
          resolve(retrievedTx.asset.data)
      })
  })
}

PIMaasManger.prototype.validate = function(schemaId, metadata, func) {
    bigchainManger.getTx(schemaId).then(function(tx) {
        func(ajv.validate(tx.asset.data.schema, metadata)) 
    }).catch(function(err) {
      console.log("XXXXXXXXXXXXXXXXXXXXXX")
      throw err;
    })
}

PIMaasManger.prototype.getTx = function(tx) {
  return new Promise(function (resolve, reject) {
      bigchainManger.getTx(tx).then(
        function(retrievedTx) {
          resolve(retrievedTx)
      })
  })
}

PIMaasManger.prototype.postTx = function(tx, func) {
    bigchainManger.postTx(tx, func);
}

module.exports = exports = new PIMaasManger();