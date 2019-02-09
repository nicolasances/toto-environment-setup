var exec = require('child_process').exec;

// Cleans NGINX by removing the container and cleaning the images
exports.do = function() {

  return new Promise(function(success, failure) {

    console.log('Filebeat : Cleaning up ... removing Docker image..');

    var command = '';

    // Remove nginx if it exists
    command += 'docker stop filebeat || true; ';
    command += 'docker rm filebeat || true; ';

    // Remove nginx
    command += 'docker rmi nicolasances/filebeat || true; ';

    // Execute the command
    exec(command, function(err, stdout, stderr) {

      if (err) {
        failure(err);
        return;
      }

      console.log('Filebeat : Docker image removed! Clean up complete!');

      success();

    });


  });

}
