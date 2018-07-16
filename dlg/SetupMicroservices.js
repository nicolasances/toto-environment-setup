
var getGithubApis = require('./GetGithubApis');
var buildAndDeployMS = require('./BuildAndDeployMS');

exports.do = function() {

  return new Promise(function(success, failure) {

    console.log('Setting up all the Toto Microservices');

    // 1. Access Github and get the list of Microservices
    console.log('Retrieving Toto Microservices from Github');

    getGithubApis.getApis().then(function(data) {

      console.log("Retrived the following Toto Microservices from Github: ");

      console.log(data);

      // 2. Build and deploy each api
      // Save each promise and then join them
      var buildPromises = [];

      for (var i = 0; i < data.apis.length; i++) {

        buildPromises.push(buildAndDeployMS.do(data.apis[i]));

      }

      // Wait for all the promises to finish
      Promise.all(buildPromises).then(function() {

        success();

      });

    });

  });

}
