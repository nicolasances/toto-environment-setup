var exec = require('child_process').exec;

// Cleans NGINX by removing the container and cleaning the images
exports.do = function() {

  return new Promise(function(success, failure) {

    console.log('NGINX : Cleaning up ... removing Docker image..');

    var command = '';

    // Remove nginx if it exists
    command += 'docker stop toto-nginx || true; ';
    command += 'docker rm toto-nginx || true; ';

    // Remove nginx
    command += 'docker rmi toto-nginx || true; ';

    // Execute the command
    exec(command, function(err, stdout, stderr) {

      if (err) {
        failure(err);
        return;
      }

      console.log('NGINX : Docker image removed! Clean up complete!');

      success();

    });


  });

}
