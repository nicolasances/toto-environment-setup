var cleanFilebeat = require('./FilebeatClean');
var downloadFilebeat = require('./FilebeatGetCode');
var buildFilebeat = require('./FilebeatBuild');
var runFilebeat = require('./FilebeatRun');

/**
 * Setup Mongo DB.
 */
exports.do = function(conf) {

  return new Promise(function(success, failure) {

    console.log('Filebeat : setting up...');

    // Clean
    cleanFilebeat.do(conf).then(() => {

      return downloadFilebeat.do(conf);

    }, failure).then(() => {

      return buildFilebeat.do(conf);

    }, failure).then(() => {

      return runFilebeat.do(conf);

    }, failure).then(success, failure);

  });

}
