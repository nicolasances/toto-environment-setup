var http = require('request');

/**
 * This function will build the provided microservice and deploy it on the Docker Engine
 */
exports.do = function(api, conf) {

  return new Promise(function(success, failure) {

    // Some checks
    // A. Check that api <> NULL
    if (api == null) {

      // Log the error
      console.log("Toto Microservices - ERROR! Requested released of a microservice, but api == null!! Going on as if nothing happened... :) ");

      // Go on, if the API is null we shouldn't care
      success(); return;
    }

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
        skipDockerRelease: api.skipDockerRelease
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

          try {
            // Parse the body of the response, should contain the status
            let statusResponse = JSON.parse(body);

            // Fullfil the promise
            ok(statusResponse);

          } catch (e) {
            // Log the error
            console.log('Toto Microservices : [' + microservice + '] - ERROR in retreiving the status from toto-ci-release. Following error received:');
            console.log('Toto Microservices : [' + microservice + '] - JSON body received: ' + body);
            console.log(e);

            // Fail the call
            fail({message: 'Error in release of ' + microservice + '. Error retrieving the status of the release.'});
          }

        });
      });

    }

    // function for polling the status of the release
    var poll = function() {

      getStatus(api.localhost).then((result) => {

        // Log the status IF IT HAS CHANGED
        if (currentReleaseStatus != result.status) console.log("Toto Microservices : [" + result.microservice + "] - Status " + result.status);

        // Update the current status
        currentReleaseStatus = result.status;

        // Recusion termination - Terminate the polling if the status has become RELEASED
        if (result.status == 'RELEASED') {success(); return;}

        // Recursively go on with the polling
        setTimeout(poll, 1000);

      });

    }

    // Starting the polling to check the status of the microservice deployment
    poll();

  });

}
