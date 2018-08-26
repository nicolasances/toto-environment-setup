var smoke = require('./TotoMicroserviceSmoke');
var http = require('request');

// Needs the config to have the apiAuth data
exports.do = function(api, conf) {

  return new Promise(function(success, failure) {

    // Create the http request to query the data
    var req = {
      url: 'http://gateway:8080/' + api.name + '/',
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + new Buffer(process.env.TOTOAPIUSER + ':' + process.env.TOTOAPIPSWD).toString('base64'),
        'Accept': 'application/json'
      }
    }

    console.log('Tyk API Gateway : smoke testing API ' + api.localhost);

    // Call the API and check the status
    http(req, function(err, resp, body) {

      // If there's a problem check if the API has actually been deployed
      if (err || resp.statusCode == 404 || body == null || JSON.parse(body).status != 'running') {

        smoke.do(api).then(() => {

          console.log('Tyk API Gateway : Smoke test failed on Tyk API ' + api.localhost);
          failure({error: 'API ' + api.name + ' didn\'t pass the smoke test on Tyk.'});

        }, () => {

          console.log('Tyk API Gateway : Smoke test failed on Tyk API ' + api.localhost + ' but that API hasn\'t been deployed as a container, so.... kinda ok..');
          success();

        })

      }
      else success();

    });

  });

}
