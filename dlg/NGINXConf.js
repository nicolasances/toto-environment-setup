var getGithubApis = require('./GetGithubApis');
var fs = require('fs');

// Create the NGINX conf file
// To configure SSL the following parameters need to be passed: --- NO: they're taken from ENV variables
//  * conf.ssl (true)
//  * conf.host (host name)
exports.do = function(conf) {

  return new Promise(function(success, failure) {

    //Retrieve the toto web apps
    getGithubApis.getApis().then(function(data) {

      // Retrieve the toto web apps
      var webapps = [];

      for (var i = 0; i < data.apis.length; i++) {
        if (data.apis[i].localhost.startsWith('toto-web-')) webapps.push(data.apis[i]);
      }

      // Create the NGINX configuration data
      var data = '';

      // Create the basic server
      data += 'http { \r\n';
      data += '\t server { \r\n';

      // Create the SSL stuff
      if (process.env.SERVERSSL == 'true') {

        console.log("NGINX : Configuration with SSL enabled");

        data += '\t\t listen 443 ssl; \r\n';
        data += '\t\t server_name ' + process.env.SERVERHOST + '; \r\n';
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

      // Create the proxy pass for web apps
      for (var i = 0; i < webapps.length; i++) {
        data += '\t\t location /' + webapps[i].name + '/ { \r\n';
        data += '\t\t\t proxy_pass http://' + webapps[i].localhost + '/; \r\n';
        data += '\t\t\t autoindex on; \r\n';
        data += '\t\t } \r\n';
      }

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

  });

}
