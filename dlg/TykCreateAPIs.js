var createTykAPI = require('./TykCreateAPI');
var getGithubApis = require('./GetGithubApis');

// Set up of all the Toto APIs on Tyk
exports.do = function() {

  return new Promise(function(success, failure) {

    console.log("Tyk API Gateway : setting up APIs...");

    // Retrieve all APIs to set on the gateway and set them up
    getGithubApis.getApis().then(function(data) {

      // Promises array to join all the API creation promises
      var promises = [];

      // For each API, create an API on Tyk
      for (var i = 0; i < data.apis.length; i++) {

        // Create the Tyk API
        promises.push(createTykAPI.do(data.apis[i]));

      }

      // Wait for all the promises to finish
      Promise.all(promises).then(function() {

        console.log("Tyk API Gateway : APIs setup complete!");

        success();

      });

    });


  })

}
