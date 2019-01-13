
var getGithubApis = require('./GetGithubApis');
var releaseMs = require('./TotoMicroserviceRelease');


exports.do = function(conf) {

  return new Promise(function(success, failure) {

    console.log('Toto Microservices : starting set up ...');

    // 1. Access Github and get the list of Microservices
    getGithubApis.getApis().then(function(data) {

      console.log("Toto Microservices : retreived " + data.apis.length + " Toto Microservices from Github.");

      // If it's a toto-ci-*, add to the gateway, but do not allow RELEASE
      for (var i = 0; i < data.apis.length; i++) {
        if (data.apis[i].localhost.startsWith('toto-ci-')) data.apis[i].skipDockerRelease = true;
      }

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
    if (apis == null || apis.length == 0) {success(); return;}

    // Next API to release
    let api = apis.pop();

    // In case there are no more APIs to release but the pop() function keeps getting stuff out, terminate the recursion
    if (api == null) {success(); return;}

    // Release the api
    releaseMs.do(api, conf).then(() => {

      // Release next api
      releaseNextAPI(apis, conf).then(success);
    });

  });
}
