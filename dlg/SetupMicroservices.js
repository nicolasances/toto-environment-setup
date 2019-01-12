
var getGithubApis = require('./GetGithubApis');
var releaseMs = require('./TotoMicroserviceRelease');


exports.do = function(conf) {

  return new Promise(function(success, failure) {

    console.log('Toto Microservices : starting set up ...');

    // 1. Access Github and get the list of Microservices
    getGithubApis.getApis().then(function(data) {

      console.log("Toto Microservices : retreived " + data.apis.length + " Toto Microservices from Github.");

      // 2. Build and deploy each api, ONE AT A TIME
      // Save each promise and then join them
      releaseNextAPI(data.apis, conf).then(() => {

        console.log("Toto Microservices : completed deploy of all microservices!");

        success();

      }, () => {

        console.log("Toto Microservices : FAILURE deploying some microservices!");

        failure();

      });

    });

  });

}

var releaseNextAPI = function(apis, conf) {

  return new Promise(function(success, failure) {

    // Terminating condition for the recursive function: no more apis to release
    if (apis == null || apis.length == 0) success();

    // Release the api
    releaseMs.do(apis.pop(), conf).then(() = {

      // Release next api
      releaseNextAPI(apis, conf).then(success);
    });

  });
}
