var http = require('request');

exports.do = function() {

  return new Promise(function(success, failure) {

    console.log("Tyk API Gateway : performing hot reload of the gateway...");

    // Prepare the gateway reload
    var data = {
      url : "http://gateway:8080/tyk/reload",
      method: 'GET',
      headers : {
        'User-Agent' : 'node.js',
        'x-tyk-authorization': 'totocazzo'
      }
    };

    // Reload the gateway
    http(data, function(err, resp, body) {

      if (err) {
        console.log(err);
        failure(err);
        return;
      }

      console.log("Tyk API Gateway : gateway reloaded!");

      success();

    });

  })
}
