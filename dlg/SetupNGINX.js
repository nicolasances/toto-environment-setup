var createConfFile = require('./NGINXConf');
var createDockerfile = require('./NGINXDockerfile');
var stopNGINX = require('./NGINXStop');
var buildNGINX = require('./NGINXBuild');
var startNGINX = require('./NGINXStart');
var exec = require('child_process').exec;

// Set up NGINX
// The conf object is important: I need the env field to understand whether
// it's going to be a SSL based env or not
exports.do = function(conf) {

  return new Promise(function(success, failure) {

    console.log("NGINX : Starting setup...");

    // Create the NGINX configuration file
    createConfFile.do(conf).then(function() {

      // Create the Dockerfile
      createDockerfile.do().then(function() {

        // Stop NGINX if any
        stopNGINX.do().then(function() {

          // Build docker image
          buildNGINX.do().then(function() {

            // Start NGINX
            startNGINX.do().then(function() {

              console.log("NGINX : setup complete!");

              success();

            });

          });

        });

      });

    });

  });

}
