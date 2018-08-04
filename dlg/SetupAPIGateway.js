var createAPIs = require('./TykCreateAPIs');
var reloadTyk = require('./TykReload');
var createUser = require('./TykCreateUser');
var exec = require('child_process').exec;
var http = require('request');

exports.do = function(conf) {

  return new Promise(function(success, failure) {

    console.log("Tyk API Gateway : starting setup ...");

    // Command
    var command = '';

    // Stop gateway if any
    command += 'docker stop gateway || true; ';
    command += 'docker stop redis || true; ';

    // Remove gateway if any
    command += 'docker rm gateway || true; ';
    command += 'docker rm redis || true; ';

    // Install REDIS
    command += 'docker run -itd --network totonet --name redis redis; ';

    // Install Tyk Gateway
    command += 'docker run -itd --network totonet --name gateway --restart always -e TYKSECRET=totocazzo -e TYKLISTENPORT=8080 -v /tyk/tyk.conf:/opt/tyk-gateway/tyk.conf tykio/tyk-gateway; ';

    exec(command, function(err, stdout, stderr) {

      if (err != null) {
        console.log('Tyk API Gateway : Error while configuring Tyk');
        console.log(err);
        failure();
        return;
      }

      console.log("Tyk API Gateway : gateway installation complete!");

      // Creating the APIS on the Gateway
      createAPIs.do().then(() => {

        return reloadTyk.do();

      }).then(() => {

        return createUser.do(conf);

      }).then(() => {

        return reloadTyk.do();

      }).then(success);

    });

  });
}
