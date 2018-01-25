var bigchainManger = require("./bigchain_manager.js"),
  Ajv = require('ajv')

var ajv = new Ajv();

class PimTx {
    constructor() {
        this.deprecateTx = null;
        this.deadTx = null;
        this.tx = null;
    }

    getDeprecateTx() {
        return this.deprecateTx;
    }

    setDeprecateTx(tx) {
        this.deprecateTx = tx;
    }

   getDeadTx() {
        return this.deadTx;
    }

    setDeadTx(tx) {
        this.deadTx = tx;
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

var deprecatedSchema = {
  //"$schema": "http://json-schema.org/draft-06/schema#",
  "title": "Deprecate Schema",
  "type": "object",
  "properties": {
    "deprecateId": {
      "description": "schema",
      "type": "string"
    },
    "newId": {
      "description": "schema",
      "type": "string"
    },
  },
  "required": ["deprecateId", "newId"],
  "additionalProperties": false
};

var deadSchema = {
  //"$schema": "http://json-schema.org/draft-06/schema#",
  "title": "Dead Schema",
  "type": "object",
  "properties": {
    "deadId": {
      "description": "schema",
      "type": "string"
    },
  },
  "required": ["deadId"],
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
        txMeta.isDead = ajv.validate(deadSchema, data);
        txMeta.isDeprecated = ajv.validate(deprecatedSchema, data);      
        txMeta.isSet = ajv.validate(setSchema, data);
        txMeta.createdDate = new Date().getTime();
        if (txMeta.isSet == true) {
            txMeta.setName = data.name
            resolve(bigchainManger.signTx(data, txMeta, publicKey, privateKey))
        } else if (txMeta.isDead == true) {
            txMeta.setName = "dead"
            resolve(bigchainManger.signTx(data, txMeta, publicKey, privateKey))
        } else if (txMeta.isDeprecated == true) {
            txMeta.setName = "deprecated"
            resolve(bigchainManger.signTx(data, txMeta, publicKey, privateKey))
        } else {
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


PIMaasManger.prototype.getDead = function(txId) {
  return new Promise(function(resolve, reject) {
    bigchainManger.getTx(tx).then(
      function(retrievedTx) {
          pimTx.setTx(retrievedTx)
          resolve(pimTx)
      }).catch(function(err) {
        reject(err);
    })
    reject("TODO: function not implemented");
  })
}


PIMaasManger.prototype.getPimTx = function(txId) {
  

  var pimTx = new PimTx();
  return new Promise(function (resolve, reject) {
    bigchainManger.getDeprecate(txId).then(function(deprecateTx){
      bigchainManger.getDead(txId).then(function(deadTx){
        console.log(deadTx)
        pimTx.setDeadTx(deadTx)
        pimTx.setDeprecateTx(deprecateTx)
        bigchainManger.getTx(txId).then(
          function(retrievedTx) {
              pimTx.setTx(retrievedTx)
              resolve(pimTx)
          }).catch(function(err) {
            reject(err);
        })
      })
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