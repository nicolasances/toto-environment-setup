var http = require('request');

/**
 * This function will build the provided microservice and deploy it on the Docker Engine
 */
exports.do = function(api) {

  return new Promise(function(success, failure) {

    // Preparing the call
    var req = {
      url : 'http://toto-ci-release:8080/releases',
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        microservice: api.localhost
      })
    }

    // Call the API
    http(req, (err, resp, body) => {

      // Function to check the release status
      var getStatus = function(microservice) {

        return new Promise(function(success, failure) {

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

            success(JSON.parse(body));

          });
        });

      }

      // function for polling the status of the release
      var poll = function() {

        getStatus(api.localhost).then((result) => {

          if (result.satus == 'RELEASED') {success(); return;}

          setTimeout(poll, 1000);

        });

      }

      // Starting the polling to check the status of the microservice deployment
      poll();

    });

  });

}
