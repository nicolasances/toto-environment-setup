var exec = require('child_process').exec;

// Builds the docker image
exports.do = function() {

  return new Promise(function(success, failure) {

    // Build docker image command
    var nginxBuild = '';

    nginxBuild += 'cd /nginx-setup; ';
    nginxBuild += 'docker build -t toto-nginx . ;';

    console.log("NGINX : Building docker image...");

    // Build docker image
    exec(nginxBuild, function(err, stdout, stderr) {

      if (err) {
        failure(err);
        return;
      }

      console.log('NGINX : Docker image built!');

      success();

    });

  });

}
