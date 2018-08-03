var http = require('request');

exports.do = function(conf) {

  return new Promise(function(success, failure) {

    console.log("Toto Webapp : Starting setup...");

    // Create the data to pass to the Toto CI Release MS
    var body = {
      env: conf.env,
      ssl: conf.ssl,
      host: conf.host,
      microservice: 'toto',
      dockerhubUser: conf.dockerhubUser,
      dockerhubPwd: conf.dockerhubPwd
    };

    // Create the data to call the Toto CI Release Microservice
    var req = {
      url: 'http://toto-ci-release:8080/releases',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };

    // Call the API
    http(req, function(error, response, body) {

      if (error) {console.log("Toto Webapp : Setup failed!!"); console.log(error); failure(); return;}

      console.log("Toto Webapp : Setup successfull!");

      success();

    });

  });

}
