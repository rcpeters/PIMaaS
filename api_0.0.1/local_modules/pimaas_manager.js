var bigchainManger = require("./bigchain_manager.js"),
  Ajv = require('ajv')

var ajv = new Ajv();

class PimTx {
    constructor() {
        this.supersedByTx = null;
        this.tx = null;
    }

    getSuperseded() {
        return this.supersedByTx;
    }

    setSuperseded(tx) {
        this.supersedByTx = tx;
    }

    getTx() {
        return  this.tx;
    }

    setTx(tx) {
        this.tx = tx;
    }
}

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
        txMeta.createdDate = new Date().getTime();
        if (data.supersedes)
            txMeta.createdDate = data.supersedes
        if (txMeta.isSet == true) {
            txMeta.setName = data.name;
            resolve(bigchainManger.signTx(data, txMeta, publicKey, privateKey))
        }
        else {
            txMeta.schemaId = data.schemaId;
            pimaasManger.getPimTx(data.schemaId).then(function(pimTx) {
                var pimSet = pimTx.getTx().asset.data
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

PIMaasManger.prototype.getFirstSupersed = function(txId) {
  return new Promise(function (resolve, reject) {
        reject("TODO: function not implemented");
  })
}


PIMaasManger.prototype.getPimTx = function(tx) {
  
  //next line is just testing
  //bigchainManger.getSuperseId(tx);

  var pimTx = new PimTx();
  return new Promise(function (resolve, reject) {
      bigchainManger.getTx(tx).then(
        function(retrievedTx) {
          pimTx.setTx(retrievedTx)
          resolve(pimTx)
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