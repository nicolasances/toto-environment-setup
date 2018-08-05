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
      body: JSON.stringify({
        microservice: api.localhost
      });
    }

    // Call the API
    http(req, (err, resp, body) => {

      if (err || resp.statusCode == 500) {
        console.error(err);
        failure({api: api.localhost, deployed: false, message: 'Couldn\'t release ' + api.localhost});
        return;
      }

      if (resp.statusCode == 200) {
        success({api: api.localhost, deployed: true});
        return;
      }

    });

  });

}
