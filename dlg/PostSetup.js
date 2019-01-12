
var setupMongo = require('./SetupMongo');
var setupKafka = require('./SetupKafka');
var setupMicroservices = require('./SetupMicroservices');
var setupAPIGateway = require('./SetupAPIGateway');
var setupTotoWebapp = require('./SetupTotoWebapp');
var setupNGINX = require('./SetupNGINX');
var restoreMongo = require('./MongoRestore');
var scheduleMongoDump = require('./MongoScheduleDump');

/**
 * This Microservice just sets up the whole Toto Environment
 * Requirements: Docker to be installed
 */
exports.do = function(conf) {

  return new Promise(function(success, failure) {

    // 1. Validate input
    // Check that the provided conf has the required data
    if (conf == null) {failure({status: 400, error: 'No configuration provided'}); return;}

    // Prepare the list of promises, since the installation is going to do everything
    // (or most of it) in parallel
    var promises = [];

    // 2. Setup Mongo DB
    promises.push(setupMongo.do());

    // 3. Setup Kafka and Zookeeper
    promises.push(setupKafka.do());

    // 5. Setup API Gateway
    promises.push(setupAPIGateway.do(conf));

    // Wait for promises to complete and ...
    Promise.all(promises).then(function() {

      promises = [];

      // 4. Setup Toto Microservices
      promises.push(setupMicroservices.do(conf));

      // 6. Setup Toto Webapp (through CI Microservice, that's why I'm waiting this moment)
      promises.push(setupTotoWebapp.do(conf));

      // 7. Restore Mongo data
      promises.push(restoreMongo.do());

      // Wait for everything to finish and you're done!!
      Promise.all(promises).then(function() {

        // 8. Set the dump schedule for Mongo
        scheduleMongoDump.do(conf);

        // 9. Setup NGINX
        setupNGINX.do(conf).then(() => {

          console.log("Toto Environment setup complete!");

          success({status: 200, completed: true, message: 'Toto Environment setup complete!'});

        }, () => {failure({status: 500, completed: false, message: 'Toto Environment setup failed...'})});

      }, () => {failure({status: 500, completed: false, message: 'Toto Environment setup failed...'})});

    }, () => {failure({status: 500, completed: false, message: 'Toto Environment setup failed...'})});

  });
}
