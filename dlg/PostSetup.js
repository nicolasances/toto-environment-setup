
var setupMongo = require('./SetupMongo');
var setupKafka = require('./SetupKafka');
var setupMicroservices = require('./SetupMicroservices');
var setupAPIGateway = require('./SetupAPIGateway');
var setupTotoWebapp = require('./SetupTotoWebapp');
var setupNGINX = require('./SetupNGINX');

/**
 * This Microservice just sets up the whole Toto Environment
 * Requirements: Docker to be installed
 */
exports.do = function(conf) {

  return new Promise(function(success, failure) {

    // 1. Validate input
    // Check that the provided conf has the required data
    if (conf == null) failure('No configuration provided');

    // Prepare the list of promises, since the installation is going to do everything
    // (or most of it) in parallel
    var promises = [];

    // 2. Setup Mongo DB
    promises.push(setupMongo.do());

    // 3. Setup Kafka and Zookeeper
    promises.push(setupKafka.do());

    // 4. Setup Toto Microservices
    promises.push(setupMicroservices.do());

    // 5. Setup API Gateway
    promises.push(setupAPIGateway.do());

    // 6. Setup Toto Webapp
    promises.push(setupTotoWebapp.do());

    // 7. When all promises are completed, setup NGINX
    Promise.all(promises).then(function() {

      setupNGINX.do().then(function() {

        success({completed: true, message: 'Toto Environment setup complete!'});

      });
    });

  });
}
