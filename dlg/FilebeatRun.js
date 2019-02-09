var exec = require('child_process').exec;

exports.do = function(data) {

  return new Promise(function(success, failure) {

    console.log("Filebeat - Starting Docker image... ");

    var command = '';

    // Remove the microservice if it exists
    command += 'docker stop filebeat || true; ';
    command += 'docker rm filebeat || true; ';

    // Run the microservice
    command += 'docker run -d --name filebeat --network totonet --restart always -u root -v /var/lib/docker/containers:/var/lib/docker/containers -v /var/run/docker.sock:/var/run/docker.sock  nicolasances/filebeat';

    exec(command, function(err) {

      if (err) {
        console.log("Filebeat - Error starting Docker image! ");
        console.log(err);
        failure();
        return;
      }

      console.log("Filebeat - Docker image successfully started! ");

      success();

    });

  });
}
