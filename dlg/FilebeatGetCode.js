var exec = require('child_process').exec;

exports.do = function(conf) {

  return new Promise(function(success, failure) {

    console.log("Filebeat - Getting code from Github");

    // Create the command
    var command = ''

    // Remove the folder if any
    command += 'rm -r /filebeat || true; ';

    // Clone the git repository
    command += 'git clone https://github.com/nicolasances/toto-filebeat.git /filebeat; ';

    exec(command, function(err, stdout, stderr) {

      if (err) {
        console.log("Filebeat - Error: " + err);
        failure(err);
        return;
      }

      console.log("Filebeat - Code from Github downloaded!");

      success();

    });

  });
}
