var getGithubApis = require('./GetGithubApis');
var exec = require('child_process').exec;
var http = require('request');

exports.do = function() {

  return new Promise(function(success, failure) {

    // Command
    var command = '';

    // Stop gateway if any
    command += 'docker stop gateway || true; ';

    // Remove gateway if any
    command += 'docker rm gateway || true; ';

    // Install REDIS
    command += 'docker run -itd --network totonet --name redis redis; ';

    // Install Tyk Gateway
    command += 'docker run -itd --network totonet --name gateway -e TYKSECRET=totocazzo -e TYKLISTENPORT=8080 -v /tyk/tyk.conf:/opt/tyk-gateway/tyk.conf tykio/tyk-gateway; ';

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

          var promises = [];

          // For each API, create an API on Tyk
          for (var i = 0; i < data.apis.length; i++) {

            promises.push(createTykAPI(data.apis[i]));

          }

          // Wait for all the promises to finish
          Promise.all(promises).then(function() {

            success();

          });

        });

      }, 20000);

    });

  });
}

// Creates the API on Tyk
var createTykAPI = function(api) {

  return new Promise(function(success, failure) {

    // Build the JSON object to send to Tyk
    var tykApi = {
      "name": api.name,
      "slug": api.name,
      "api_id": api.localhost,
      "org_id": "53ac07777cbb8c2d53000002",
      "use_keyless": false,
      "use_basic_auth": true,
      "enable_jwt": false,
      "auth": {
        "auth_header_name": "Authorization"
      },
      "definition": {
        "location": "header",
        "key": "x-api-version"
      },
      "version_data": {
        "not_versioned": true,
        "versions": {
          "Default": {
            "name": "Default",
            "use_extended_paths": true
          }
        }
      },
      "proxy": {
        "listen_path": "/" + api.name + "/",
        "target_url": "http://" + api.localhost + ":8080/",
        "strip_listen_path": true
      },
      "active": true,
      "domain": ""
    }

    // Create the API on Tyk by calling the HTTP API
    var data = {
      url : "http://gateway:8080/tyk/apis -H 'x-tyk-authorization: totocazzo' -H 'Content-Type: application/json'",
      headers : {
        'User-Agent' : 'node.js',
        'x-tyk-authorization': 'totocazzo',
        'Content-Type' : 'application/json'
      },
      body: tykApi
    };

    console.log('Creating Tyk API ' + api.localhost);
    console.log(data);

    http.post(data, function(error, response, body) {

      console.log(body);

      success();

    });

  });

}
