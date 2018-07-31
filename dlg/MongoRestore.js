var http = require('request');

// Restores Mongo DB with prod data
exports.do = function() {

  // Function to verify that the Mongo Restore API is actually live
  var smokeMongoRestoreAPI = function() {

    return new Promise(function(success, failure) {

      var data = {
        url : 'http://toto-nodems-mongo-restore:8080/',
        method : 'GET'
      };

      http(data, function(err, resp, body) {

        if (err) failure();
        else success();

      });
    });

  }

  // Function that actually performs the restore
  var restore = function() {

    return new Promise(function(success, failure) {

      // Prepare the data to call the mongo restore API
      var body = {
        env: 'prod'
      };

      // Prepare the call to the mongo-restore API
      var data = {
          url : 'http://toto-nodems-mongo-restore:8080/restores',
          method: 'POST',
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

  return new Promise(function(success, failure) {

    console.log("Mongo DB : Restoring data from prod db..");

    smokeMongoRestoreAPI().then(function() {

      // Restore
      restore().then(success, failure);

    }, function() {

      // In case of failure
      setTimeout(function() {

        // Retry the smoke test
        smokeMongoRestoreAPI().then(function() {

          // Restore
          restore().then(success, failure);

        }, failure);

      }, 2000);

    });

  });

}
