
var exec = require('child_process').exec;

/**
 * Setup Mongo DB.
 */
exports.do = function() {

  return new Promise(function(success, failure) {

    // Setup the command for executing mongo
    var command = '';

    // Stop Mongo if it already exists
    command += 'docker stop mongo || true; ';

    // Remove Mongo if any
    command += 'docker rm mongo || true; ';

    // Run mongo
    command += 'docker run -d -v /mongo-setup:/mongo-setup -v /mongo-data:/mongo-data --network totonet --restart always --name mongo mongo';

    // Execute mongo
    exec(command, function(err, stdout, stderr) {

      if (err != null) {
        console.log(err);
        failure(err);
      }

      success();

    });

  });

}
