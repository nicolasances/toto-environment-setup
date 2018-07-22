var installMongo = require('./dlg/MongoInstall');
var exec = require('child_process').exec;

/**
 * Setup Mongo DB.
 */
exports.do = function() {

  return new Promise(function(success, failure) {

    console.log('Mongo DB : setting up...');

    // Install Mongo DB
    installMongo.do().then(function() {

      console.log("Mongo DB : setup complete!");

      success();

    });

  });

}
