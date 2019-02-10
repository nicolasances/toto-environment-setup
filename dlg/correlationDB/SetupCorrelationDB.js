var installMongo = require('./CorrelationMongoInstall');

/**
 * Setup Mongo DB.
 */
exports.do = function() {

  return new Promise(function(success, failure) {

    console.log('Correlation DB : setting up...');

    // Install Mongo DB
    installMongo.do().then(() => {

      console.log("Correlation DB : setup complete!");

      success();

    });

  });

}
