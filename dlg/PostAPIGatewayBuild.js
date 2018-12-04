var setupAPIGateway = require('./SetupAPIGateway');

/**
 * This Microservice just sets up the whole Toto Environment
 * Requirements: Docker to be installed
 */
exports.do = function() {

  return new Promise(function(success, failure) {

    console.log("API Gateway build started!");

    // Setup NGINX
    setupAPIGateway.do().then(() => {

      console.log("API Gateway build completed!");

      success({status: 200, completed: true, message: 'API Gateway build complete!'});

    }, () => {failure({status: 500, completed: false, message: 'API Gateway build failed...'})});

  });
}
