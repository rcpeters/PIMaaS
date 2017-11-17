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
const driver = require('bigchaindb-driver');

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
  createSet: createSet
};

/*
 sample curl:
 `curl -v -H  "Content-Type: application/json" -H"publicKey: yo " -H"privateKey: yo "  -d '{"name":"test", "schema": {"test":"test"}}' -X POST "http://localhost:10010/set"`
*/
function createSet(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var privateKey = req.swagger.params.privateKey.value;
  var publicKey = req.swagger.params.publicKey.value;
  console.log(req.swagger.params);
  var msg = {name:"test", schema: {}};

  // this sends back a JSON response which is a single string
  res.location('/test_blah_blah')
  res.json(201,msg);
}

