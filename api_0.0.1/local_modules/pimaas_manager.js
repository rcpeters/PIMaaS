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

//var validateSet = ajv.compile(setSchema);


// singleton https://team.goodeggs.com/export-this-interface-design-patterns-for-node-js-modules-b48a3b1f8f40
function PIMaasManger () {
   console.log("New PIMaasManger Instance")
}

PIMaasManger.prototype.getEd25519Keypair = function() {
    bigchainManger.getEd25519Keypair();
}

PIMaasManger.prototype.signTxAndPost = function(data, publicKey, privateKey, func) {
    console.log(data)
    var txMeta = {};
    var pimaasManger = this
    txMeta.isSet = ajv.validate(setSchema,data); 
    if (txMeta.isSet == true) {
        txMeta.setName = data.name;
        pimaasManger.postTx(pimaasManger.signTx(data, txMeta, publicKey, privateKey), func);
    }
    else {
        txMeta.schemaId = data.schemaId;
        pimaasManger.getSchema(data.schemaId, function(pimSet) {
            console.log(ajv.validate(pimSet.schema,data.metadata))
            txMeta.setName = pimSet.name
            if (ajv.validate(pimSet.schema,data.metadata)) {
                pimaasManger.postTx(pimaasManger.signTx(data, txMeta, publicKey, privateKey), func);
            }
            else
                throw new Error("Doesn't validate");
        })

    }
    
        
}

PIMaasManger.prototype.signTx = function(data, metadata, publicKey, privateKey) {
    return bigchainManger.signTx(data, metadata, publicKey, privateKey);
}

PIMaasManger.prototype.getSet = function(txId, func) {
    this.getTx(txId, function(tx) {func(tx.asset.data)})
}

PIMaasManger.prototype.getSchema = function(schemaId, func) {
    this.getTx(schemaId, function(tx) {func(tx.asset.data)})
}


PIMaasManger.prototype.validate = function(schemaId, metadata, func) {
    bigchainManger.getTx(schemaId, function(tx) {
        func(ajv.validate(tx.asset.data.schema, metadata)) 
    })
}

PIMaasManger.prototype.getTx = function(tx, func) {
    bigchainManger.getTx(tx, func);
}

PIMaasManger.prototype.postTx = function(tx, func) {
    bigchainManger.postTx(tx, func);
}

module.exports = exports = new PIMaasManger();
