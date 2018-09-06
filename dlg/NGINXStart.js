var exec = require('child_process').exec;

exports.do = function(conf) {

  return new Promise(function(success, failure) {

    // Define PORT number
    var port = process.env.SERVERSSL ? '-p 443:443' : '-p 80:80';

    // Define volumes for certificates
    var certificateVolume = '';
    if (process.env.SERVERSSL == 'true') certificateVolume = '-v /etc/letsencrypt/archive/' + process.env.SERVERHOST + ':/certificates';

    console.log('NGINX : Starting NGINX...');

    // Start NGINX
    var startCmd = 'docker run -d ' + port + ' ' + certificateVolume + ' --network totonet --restart always --name toto-nginx toto-nginx'

    console.log('NGINX : Command: ' + startCmd);

    exec(startCmd, function(err, stdout, stderr) {

      if (err) {
        failure(err);
        return;
      }

      success();

    });


  });
}
