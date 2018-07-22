
var setupMongo = require('./SetupMongo');
var setupKafka = require('./SetupKafka');
var setupMicroservices = require('./SetupMicroservices');
var setupAPIGateway = require('./SetupAPIGateway');
var setupTotoWebapp = require('./SetupTotoWebapp');
var setupNGINX = require('./SetupNGINX');
var restoreMongo = require('./MongoRestore');

/**
 * This Microservice just sets up the whole Toto Environment
 * Requirements: Docker to be installed
 */
exports.do = function(conf) {

  return new Promise(function(success, failure) {

    // 1. Validate input
    // Check that the provided conf has the required data
    if (conf == null) {failure('No configuration provided'); return;}
    if (conf.env == null) {failure('No "env" field provided in the configuration object. Please provide an env: "prod" or "dev"'); return;}

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

    // Wait for promises to complete and ...
    Promise.all(promises).then(function() {

      promises = [];

      // 7. Restore Mongo data
      promises.push(restoreMongo.do());

      // 8. Setup NGINX
      promises.push(setupNGINX.do(conf));

      // Wait for everything to finish and you're done!!
      Promise.all(promises).then(function() {

        success({completed: true, message: 'Toto Environment setup complete!'});

      });
    });

  });
}
