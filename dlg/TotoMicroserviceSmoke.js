var smoke = require('./TotoMicroserviceSmoke');
var http = require('request');

exports.do = function(api) {

  return new Promise(function(success, failure) {

    // Create the http request to query the data
    var req = {
      url: 'http://' + api.localhost + ':8080/',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'x-correlation-id': 'setup'
      }
    }

    // Call the API and check the status
    http(req, function(err, resp, body) {

      if (err || body == null || JSON.parse(body).status != 'running') failure();
      else success();

    });

  });

}
