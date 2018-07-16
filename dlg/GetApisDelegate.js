var getGithubApisDlg = require('./GetGithubApisDelegate');
var smokeApiDlg = require('./SmokeApiDelegate');
var http = require('request');

var cachedApiList;
var cacheTime = null;

exports.getApis = function() {

  return new Promise(function(success, failure) {

    var apis = null;

    getGithubApisDlg.getApis().then(function(githubApis) {

      apis = githubApis;

      for (var i = 0; i < githubApis.apis.length; i++) {

        var api = githubApis.apis[i];

        smokeApiDlg.smoke(api).then(function(stat) {

          if (stat != null && stat.status == 'running') setApiStatus(stat.api, 'running');
          else setApiStatus(stat.api, 'down');

          if (allApisStatusesGathered()) {
            success(apis);
          }
        }).catch(function(reason) {
          console.log(reason);
        });

      }

      /**
       * Checks that the status has been retrieved for each api
       */
      var allApisStatusesGathered = function() {
        var count = 0;
        for (var i = 0; i < apis.apis.length; i++) {
          if (apis.apis[i].status != null) count++;
        }

        if (count == apis.apis.length) return true;

        return false;
      }

      /**
       * Sets the API status (running, down, ..)
       */
      var setApiStatus = function(apiName, status) {
        for (var i = 0; i < githubApis.apis.length; i++) {
          if(githubApis.apis[i].name == apiName) githubApis.apis[i].status = status;
        }
      }

    }).catch(function(reason) {
      console.log(reason);
    });

  });
}
