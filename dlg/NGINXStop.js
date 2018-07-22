var exec = require('child_process').exec;

// Removes the NGINX container
exports.do = function() {

  return new Promise(function(success, failure) {

    // Create docker command
    var command = '';

    // Stop NGINX if any
    command += 'docker stop toto-nginx || true; ';
    command += 'docker rm toto-nginx || true; ';

    exec(command, function(err, stdout, stderr) {

      if (err) {
        failure(err);
        return;
      }

      success();

    });

  });
}
