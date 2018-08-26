var http = require('request');

/**
 * This function will build the provided microservice and deploy it on the Docker Engine
 */
exports.do = function(api, conf) {

  return new Promise(function(success, failure) {

    var currentReleaseStatus = '';

    // Preparing the call
    var req = {
      url : 'http://toto-ci-release:8080/releases',
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        microservice: api.localhost,
        env: conf.env,
        ssl: conf.ssl,
        host: conf.host
      })
    }

    // Call the API
    http(req, (err, resp, body) => {});

    // Function to check the release status
    var getStatus = function(microservice) {

      return new Promise(function(ok, fail) {

        // Prepare the polling request
        var r = {
          url : 'http://toto-ci-release:8080/releases/' + microservice,
          method : 'GET',
          headers : {
            'Accept' : 'application/json'
          }
        };

        // Retrieve the status
        http(r, (err, resp, body) => {

          ok(JSON.parse(body));

        });
      });

    }

    // function for polling the status of the release
    var poll = function() {

      getStatus(api.localhost).then((result) => {

        if (currentReleaseStatus != result.status) console.log("Toto Microservices : [" + result.microservice + "] - Status " + result.status);

        currentReleaseStatus = result.status;

        if (result.status == 'RELEASED') {success(); return;}

        setTimeout(poll, 1000);

      });

    }

    // Starting the polling to check the status of the microservice deployment
    poll();

  });

}
