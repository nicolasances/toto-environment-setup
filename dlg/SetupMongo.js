var installMongo = require('./MongoInstall');
var exec = require('child_process').exec;

/**
 * Setup Mongo DB.
 */
exports.do = function() {

  return new Promise(function(success, failure) {

    console.log('Mongo DB : setting up...');

    // Install Mongo DB
    installMongo.do().then(() => {

      console.log("Mongo DB : setup complete!");

      success();

    });

  });

}
