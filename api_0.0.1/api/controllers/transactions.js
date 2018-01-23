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
  getTransaction: getTransaction,
  createTransaction: createTransaction
};

/*
  TODO: Test
*/
function createTransaction(req, res) {
  console.log(req.body);
 
  pimaasManger.Post(req.body, 
    function(trans){ 
    // this sends back a JSON response which is a single string
    console.log(JSON.stringify(trans, null, 4))
      res.location('/sets/' + trans.id)
      res.status(201).json(trans.asset.data)
  }).catch(function(err) {
        res.status(400).json(err);
  })
}

function getTransaction(req, res) {
  var id = req.swagger.params.id.value;
  pimaasManger.getPimTx(id).then(function(tx){
      res.status(200).json(tx)
  }).catch(function(err) {
        res.status(400).json(err);
  })
}
