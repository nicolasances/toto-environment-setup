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
        'Authorization': 'Basic ' + new Buffer(conf.apiAuth.user + ':' + conf.apiAuth.pwd).toString('base64'),
        'Accept': 'application/json'
      }
    }

    console.log('Tyk API Gateway : smoke testing API ' + api.localhost);

    // Call the API and check the status
    http(req, function(err, resp, body) {

      console.log(resp);

      // If there's a problem check if the API has actually been deployed
      if (err || resp.status == 404 || body == null || JSON.parse(body).status != 'running') {

        smoke.do(api).then(() => {
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
