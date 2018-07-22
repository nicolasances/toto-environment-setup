
var exec = require('child_process').exec;

exports.do = function() {

  return new Promise(function(success, failure) {

    // Create command
    var command = '';

    // Remove old versions
    command += 'docker stop toto || true; ';
    command += 'docker rm toto || true; ';

    // Pull the image from
    command += 'docker run -d --network totonet --name toto --restart always nicolasances/toto:latest';

    exec(command, function(err, stdout, stderr) {

      if (err != null) {
        console.log('Could not deploy toto');
      }

      success();

    });

    success();

  });

}
