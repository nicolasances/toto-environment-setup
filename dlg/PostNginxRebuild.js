var setupNGINX = require('./SetupNGINX');

/**
 * This Microservice just sets up the whole Toto Environment
 * Requirements: Docker to be installed
 */
exports.do = function() {

  return new Promise(function(success, failure) {

    // Setup NGINX
    setupNGINX.do().then(() => {

      console.log("NGINX Rebuild completed!");

      success({status: 200, completed: true, message: 'NGINX Rebuild complete!'});

    }, () => {failure({status: 500, completed: false, message: 'NGINX Rebuild failed...'})});

  });
}
