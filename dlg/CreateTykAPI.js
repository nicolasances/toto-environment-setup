var http = require('request');

exports.do = function() {

  return new Promise(function(success, failure) {

    // Build the JSON object to send to Tyk
    var tykApi = {
      "name": 'expenses',
      "slug": 'expenses',
      "api_id": 'expenses',
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
        "listen_path": "/expenses/",
        "target_url": "http://toto-nodems-expenses:8080/",
        "strip_listen_path": true
      },
      "active": true,
      "domain": ""
    }

    // Create the API on Tyk by calling the HTTP API
    var data = {
      url : "http://gateway:8080/tyk/apis",
      method: 'POST',
      headers : {
        'User-Agent' : 'node.js',
        'x-tyk-authorization': 'totocazzo',
        'Content-Type' : 'application/json'
      },
      body: tykApi
    };

    console.log('Creating Tyk API');
    console.log(data);

    http.post(data, function(error, response, body) {

      console.log(body);

      success();

    });

  });

}
