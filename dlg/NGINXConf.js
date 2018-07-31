
var fs = require('fs');

// Create the NGINX conf file
// To configure SSL the following parameters need to be passed:
//  * conf.ssl (true)
//  * conf.host (host name)
exports.do = function(conf) {

  return new Promise(function(success, failure) {

    // Create the NGINX configuration data
    var data = '';

    // Create the basic server
    data += 'http { \r\n';
    data += '\t server { \r\n';

    // Create the SSL stuff
    if (conf.ssl) {
      data += '\t\t listen 443 ssl; \r\n';
      data += '\t\t server_name ' + conf.host + '; \r\n';
      data += '\t\t ssl_certificate /certificates/fullchain1.pem; \r\n';
      data += '\t\t ssl_certificate_key /certificates/privkey1.pem; \r\n';
    }

    // Create the toto proxy pass
    data += '\t\t location /toto/ { \r\n';
    data += '\t\t\t proxy_pass http://toto/; \r\n';
    data += '\t\t } \r\n';

    // Create the gateway proxy pass
    data += '\t\t location /apis/ { \r\n';
    data += '\t\t\t proxy_pass http://gateway:8080/; \r\n';
    data += '\t\t } \r\n';

    // Close the basic http and server config
    data += '\t } \r\n';
    data += '} \r\n';

    // Events tag
    data += 'events {} \r\n';

    // Create the file
    fs.writeFile('/nginx-setup/nginx.conf', data, function(err, data) {

      if (err) {
        failure(err);
        return;
      }

      console.log("NGINX : nginx.conf file created!");

      success();

    });

  });

}
