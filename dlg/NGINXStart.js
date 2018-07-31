var exec = require('child_process').exec;

exports.do = function(conf) {

  return new Promise(function(success, failure) {

    // Define PORT number
    var port = conf.ssl ? '-p 443:443' : '-p 80:80';

    // Define volumes for certificates
    var certificateVolume = '';
    if (conf.ssl) '-v /etc/letsencrypt/archive/' + conf.host + ':/certificates';

    console.log('NGINX : Starting NGINX...');
    console.log('NGINX : SSL : ' + conf.ssl);
    console.log('NGINX : SSL Host : ' + conf.host);

    // Start NGINX
    var startCmd = 'docker run -d ' + port + ' ' + certificateVolume + ' --network totonet --restart always --name toto-nginx toto-nginx'

    exec(startCmd, function(err, stdout, stderr) {

      if (err) {
        failure(err);
        return;
      }

      success();

    });


  });
}
