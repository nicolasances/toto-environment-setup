var exec = require('child_process').exec;

// The nested parameter (true or false or null) is there to specify whether
// the microservice on github has a nested folder under the root ... old microservices
exports.do = function(data, nested) {

  return new Promise(function(success, failure) {

    console.log("Filebeat - Building Docker image... ");

    // Where is the docker file?
    var dockerFileFolder = '/filebeat';

    var command = '';

    // Build filebeat
    command += 'docker build -t nicolasances/filebeat ' + dockerFileFolder;

    exec(command, function(err) {

      if (err) {
        if (err.indexOf('No such container') >= 0) {
          justBuild();
          return;
        }
      }

      console.log("Filebeat - Docker image successfully built! ");

      success();

    });

  });
}
