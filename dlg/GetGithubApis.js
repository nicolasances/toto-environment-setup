var http = require('request');
var moment = require('moment');

exports.getApis = function() {

  return new Promise(function(success, failure) {

    var data = {
      url : "http://toto-ci-api-list:8080/apis",
      method: 'GET',
      headers : {
        'Accept' : 'application/json'
      }
    };

    http(data, function(err, response, body) {

      if (response.statusCode == 200) success(JSON.parse(body));
      else failure(body);
    });

  });
}
