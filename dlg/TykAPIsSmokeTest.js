var getGithubApis = require('./GetGithubApis');
var smoke = require('./TykAPISmokeTest');

exports.do = function(conf) {

  return new Promise(function(success, failure) {

    console.log("Tyk API Gateway : checking that APIs are actually deployed...");

    // Retrieve all APIs to set on the gateway and set them up
    getGithubApis.getApis().then(function(data) {

      // Promises array to join all the API creation promises
      var promises = [];

      // For each API, create an API on Tyk
      for (var i = 0; i < data.apis.length; i++) {

        // Create the Tyk API
        promises.push(smoke.do(data.apis[i], conf));

      }

      // Wait for all the promises to finish
      Promise.all(promises).then(function() {

        console.log("Tyk API Gateway : all APIs have been smoke tested. Everything fine.");

        success();

      });

    });

  });

}
