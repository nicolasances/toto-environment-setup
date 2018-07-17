var getGithubApisDlg = require('./GetGithubApis');
var http = require('request');

var cachedApiList;
var cacheTime = null;

exports.getApis = function() {

  return new Promise(function(success, failure) {

    getGithubApisDlg.getApis().then(function(githubApis) {

      success(githubApis);

    }).catch(function(reason) {
      console.log(reason);
    });

  });
}
