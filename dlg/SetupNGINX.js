var createConfFile = require('./NGINXConf');
var createDockerfile = require('./NGINXDockerfile');
var stopNGINX = require('./NGINXStop');
var buildNGINX = require('./NGINXBuild');
var startNGINX = require('./NGINXStart');
var cleanNGINX = require('./NGINXClean');
var exec = require('child_process').exec;

// Set up NGINX
// The conf object is important: I need the env field to understand whether
// it's going to be a SSL based env or not
exports.do = function(conf) {

  return new Promise(function(success, failure) {

    console.log("NGINX : Setting up...");

    // Clean environment
    cleanNGINX.do().then(() => {

      // Create the NGINX configuration file
      createConfFile.do(conf).then(function() {

        // Create the Dockerfile
        createDockerfile.do(conf).then(function() {

          // Stop NGINX if any
          stopNGINX.do(conf).then(function() {

            // Build docker image
            buildNGINX.do(conf).then(function() {

              // Start NGINX
              startNGINX.do(conf).then(function() {

                console.log("NGINX : setup complete!");

                success();

              });

            });

          });

        });

      });

    });

  });

}
