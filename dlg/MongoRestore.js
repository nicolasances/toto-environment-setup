var http = require('request');

// Restores Mongo DB with prod data
exports.do = function() {

  return new Promise(function(success, failure) {

    console.log("Mongo DB : Restoring data from prod db..");

    // Prepare the data to call the mongo restore API
    var body = {
      env: 'prod'
    };

    // Prepare the call to the mongo-restore API
    var data = {
        url : 'http://toto-nodems-mongo-restore:8080/restores',
        headers : {
          'Content-Type' : 'application/json',
          'Accept' : 'application/json'
        },
        body: JSON.stringify(body)
    };

    // Call the API
    http(data, function(err, resp, body) {

      if (err) {
        failure(err);
        return;
      }

      console.log("Mongo DB : data succesfully restored!");

      success();

    });

  });

}
