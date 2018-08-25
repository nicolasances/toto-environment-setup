
var getGithubApis = require('./GetGithubApis');
var releaseMs = require('./TotoMicroserviceRelease');

exports.do = function() {

  return new Promise(function(success, failure) {

    console.log('Toto Microservices : starting set up ...');

    // 1. Access Github and get the list of Microservices
    getGithubApis.getApis().then(function(data) {

      console.log(data);

      console.log("Toto Microservices : retreived " + data.apis.length + " Toto Microservices from Github.");

      // 2. Build and deploy each api
      // Save each promise and then join them
      var buildPromises = [];

      for (var i = 0; i < data.apis.length; i++) {

        // Exclude toto-ci apis since they have already been deployed through init.sh
        if (data.apis[i].type == 'toto-ci') continue;

        console.log("Toto Microservices : deploying " + data.apis[i].localhost);

        // Build and release the microservice
        buildPromises.push(releaseMs.do(data.apis[i]));

      }

      // Wait for all the promises to finish
      Promise.all(buildPromises).then(function() {

        console.log("Toto Microservices : completed deploy of all microservices!");

        success();

      }, failure);

    });

  });

}
