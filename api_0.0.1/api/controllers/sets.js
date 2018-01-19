'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');
var pimaasManger = require("../../local_modules/pimaas_manager.js");

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  createSet: createSet,
  getSet: getSet
};

/*
 sample curl:
 curl -v -H  "Content-Type: application/json" -H"publicKey: H68uBZ4GrrxiyKnbuANUUKRS6KfFbgFDy47ZXDLmRJUH" -H"privateKey: FHXs4Q84SZWSj3E62gNjjemYve3PMPAqgfavzTEtBTTX"  -d '{"name":"test", "schema": {}}' -X POST "http://localhost:10010/sets"
*/

function createSet(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var privateKey = req.swagger.params.privateKey.value;
  var publicKey = req.swagger.params.publicKey.value;
  //console.log(JSON.stringify(req.swagger));
  //console.log(req.body);
  
  pimaasManger.signTxAndPost(req.body, publicKey, privateKey, 
    function(trans){ 
    // this sends back a JSON response which is a single string
    console.log(JSON.stringify(trans, null, 4));
      res.location('/sets/' + trans.id)
      res.status(201).json(trans.asset.data);
  })
}

/*
 sample curl:
 curl -v  "http://localhost:10010/sets/efdb41501f32e793f9706505e51d9af9d6c5e26d36590edf79fa2cd776800562"
*/
function getSet(req, res) {
  var setId = req.swagger.params.setId.value;
  pimaasManger.getSet(setId).then(function(tx){
      res.status(200).json(tx);
  })
}
