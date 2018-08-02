
var exec = require('child_process').exec;

/**
 * This function will build the provided microservice and deploy it on the Docker Engine
 */
exports.do = function(microservice) {

  return new Promise(function(success, failure) {

    // Creating the command
    var command = '';

    // Remove miroservice image if it already existed
    command += 'docker stop ' + microservice.localhost + ' || true; ';
    command += 'docker rm ' + microservice.localhost + ' || true; ';

    // Eventually start sharing docker.sock
    var sock = '';
    if (microservice.localhost.startsWith('toto-ci-')) sock = ' -v /var/run/docker.sock:/var/run/docker.sock -v $(which docker):/usr/bin/docker ';

    // Pull the image from
    command += 'docker run -d --network totonet --name ' + microservice.localhost + sock + ' --restart always nicolasances/' + microservice.localhost + ':latest';

    exec(command, function(err, stdout, stderr) {

      if (err != null) {
        console.log('Toto Microservices : Could not deploy ' + microservice.localhost);
      }

      success();

    });

  });

}
