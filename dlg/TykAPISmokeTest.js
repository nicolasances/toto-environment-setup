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

    console.log('Tyk API Gateway : smoke testing API ' + api.name);

    // Call the API and check the status
    http(req, function(err, resp, body) {

      if (err) {failure({error: 'API ' + api.name + ' didn\'t pass the smoke test on Tyk. ' + err}); return;}
      if (body == null) {failure({error: 'API ' + api.name + ' didn\'t pass the smoke test on Tyk.'}); return;}

      if (body.status == 'running') {success(); return;}

      failure({error: 'API ' + api.name + ' didn\'t pass the smoke test on Tyk.'});

    });

  });

}
