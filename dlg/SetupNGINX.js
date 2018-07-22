var fs = require('fs');

// Set up NGINX
// The conf object is important: I need the env field to understand whether
// it's going to be a SSL based env or not
exports.do = function(conf) {

  return new Promise(function(success, failure) {

    console.log("NGINX : Starting setup...");

    // Create the NGINX configuration data
    var data = '';

    // Create the basic server
    data += 'http { \r\n';
    data += '\t server { \r\n';

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

    // Create the file
    fs.writeFile('/nginx-setup/nginx.conf', data, function(err, data) {

      if (err) {
        failure(err);
        return;
      }

      console.log("NGINX : setup complete!");

      success();
    })


  });

}
