var getGithubApis = require('./GetGithubApis');
var createTykAPI = require('./CreateTykAPI');
var exec = require('child_process').exec;
var http = require('request');

exports.do = function() {

  return new Promise(function(success, failure) {

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
        console.log('Error while configuring Tyk');
        console.log(err);
        failure();
        return;
      }

      setTimeout(function() {

        // Retrieve all APIs to set on the gateway and set them up
        getGithubApis.getApis().then(function(data) {

          // Promises array to join all the API creation promises
          var promises = [];

          // For each API, create an API on Tyk
          for (var i = 0; i < data.apis.length; i++) {

            // Create the Tyk API
            promises.push(createTykAPI.do(data.apis[i]));

          }

          // Wait for all the promises to finish
          Promise.all(promises).then(function() {

            // Prepare the gateway reload
            var data = {
              url : "http://gateway:8080/tyk/reload",
              method: 'GET',
              headers : {
                'User-Agent' : 'node.js',
                'x-tyk-authorization': 'totocazzo',
                'Content-Type' : 'application/json'
              }
            };

            // Reload the gateway
            http(data, function(err, resp, body) {

              if (err) console.log(err);
              console.log(body);

              success();
            });

          });

        });

      }, 5000);

    });

  });
}
