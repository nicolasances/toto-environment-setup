var http = require('request');
var getGithubApis = require('./GetGithubApis');

// Create the Tyk user
exports.do = function(conf) {

  return new Promise(function(success, error) {

    console.log("Tyk API Gateway : creating API User...");

    // Retrieve the APIs that user is going to have access to...
    getGithubApis.getApis().then(function(data) {

      // Create the access_rights object
      var accessRights = new Object();

      // We're going to allow the API definition
      accessRights.1 = {
        "api_id": "1",
        "api_name": "Tyk Test API",
        "versions": ["Default"]
      }

      // Now create the whole "create user" object
      var key = {
        "allowance": 1000,
        "rate": 1000,
        "per": 1,
        "expires": -1,
        "quota_max": -1,
        "org_id": "53ac07777cbb8c2d53000002",
        "quota_renews": 1449051461,
        "quota_remaining": -1,
        "quota_renewal_rate": 60,
        "access_rights": accessRights,
        "meta_data": {},
        "basic_auth_data": {
          "password": process.env.TOTOAPIPSWD
        }
      };

      // Define the user name
      var user = 'toto';

      // Create the user on Tyk
      var data = {
        url : "http://gateway:8080/tyk/keys/" + process.env.TOTOAPIUSER,
        method: 'POST',
        headers : {
          'User-Agent' : 'node.js',
          'x-tyk-authorization': 'totocazzo',
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(key)
      };

      http(data, function(error, response, body) {

        if (error) {
          failure(error);
          return;
        }

        console.log("Tyk API Gateway : API user created!");

        success();

      });

    });

  })
}
