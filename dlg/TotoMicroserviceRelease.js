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

      // Starting the polling to check the status of the microservice deployment
      var status = null;
      while (status != 'RELEASED') {

        setTimeout(() => {

          // Prepare the polling request
          var r = {
            url : 'http://toto-ci-release:8080/releases/' + api.localhost,
            method : 'GET',
            headers : {
              'Accept' : 'application/json'
            }
          };

          // Retrieve the status
          http(r, (err, resp, body) => {

            var response = JSON.parse(body);

            if (response.status != status) console.log('[' + api.localhost + '] - ' + response.status);

            if (body) status = response.status;

          });

        }, 1000);
      }

      success();

    });

  });

}
