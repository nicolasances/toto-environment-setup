var exec = require('child_process').exec;

// Setup Mongo DB
exports.do = function() {

  return new Promise(function(success, failure) {

    // Setup the command for executing mongo
    var command = '';

    // Stop Mongo if it already exists
    command += 'docker stop mongo || true; ';

    // Remove Mongo if any
    command += 'docker rm mongo || true; ';

    // Run mongo
    // No need to mount volumes: I don't care about losing the data
    command += 'docker run -d --network totonet --restart always --name toto-db-correlation mongo:4';

    // Execute mongo
    exec(command, function(err, stdout, stderr) {

      if (err != null) {
        console.log(err);
        failure(err);
        return;
      }

      success();

    });

  });

}
