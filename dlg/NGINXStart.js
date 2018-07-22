var exec = require('child_process').exec;

exports.do = function() {

  return new Promise(function(success, failure) {

    // Define PORT number
    var port = '-p 80:80';

    // Define volumes for certificates
    var certificateVolume = '';

    console.log('NGINX : Starting NGINX...');

    // Start NGINX
    var startCmd += 'docker run -d ' + port + ' ' + certificateVolume + ' --network totonet --restart always --name toto-nginx toto-nginx'

    exec(startCmd, function(err, stdout, stderr) {

      if (err) {
        failure(err);
        return;
      }

      success();

    });


  });
}
