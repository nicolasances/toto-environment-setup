var http = require('request');

exports.do = function(api) {

  return new Promise(function(success, failure) {

    // Build the JSON object to send to Tyk
    var tykApi = {
      "name": api.name,
      "slug": api.name,
      "api_id": api.localhost,
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
      "CORS": {
        "enable": true,
        "allowed_origins": [
          *
        ],
        "allowed_methods": ["OPTIONS", "GET", "PUT", "POST", "DELETE"],
        "allowed_headers": ["Accept", "Content-Type", "Authorization"],
        "exposed_headers": [],
        "allow_credentials": false,
        "max_age": 24,
        "options_passthrough": false,
        "debug": false
      },
      "proxy": {
        "listen_path": "/" + api.name + "/",
        "target_url": "http://" + api.localhost + ":8080/",
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
      body: JSON.stringify(tykApi)
    };

    console.log('Creating Tyk API ' + api.name + " - " + api.localhost);

    http(data, function(error, response, body) {

      success();

    });

  });

}
