
var fs = require('fs');

// Create the NGINX Dockerfile
exports.do = function() {

  return new Promise(function(success, failure) {

    // Create the Dockerfile content
    var dockerfile = '';

    dockerfile += 'FROM nginx \r\n';
    dockerfile += 'COPY nginx.conf /etc/nginx/nginx.conf \r\n';
    dockerfile += 'RUN mkdir /certificates \r\n';
    dockerfile += 'VOLUME [“/certificates”] \r\n';

    // Create the file
    fs.writeFile('/nginx-setup/Dockerfile', dockerfile, function(err, data) {

      if (err) {
        failure(err);
        return;
      }

      console.log("NGINX : Dockerfile created!");

      success();

    });

  });

}
