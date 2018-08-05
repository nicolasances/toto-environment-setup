var http = require('request');

exports.do = function(conf) {

  return new Promise(function(success, failure) {

    if (conf.dataDumpCron == null || conf.dataDumpCron == '') {
      success();
      return;
    }

    // Prepare request
    var req = {
      url: 'http://toto-nodems-mongo-dump-scheduler:8080/schedule',
      method: 'PUT',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({env: conf.env, cron: conf.dataDumpCron})
    };

    // Send request
    http(req, function(err, resp, body) {

      if (err || body == null) {
        console.log(err);
        failure({error: 'Couldn\'t schedule Mongo dump'});
        return;
      }

      if (JSON.parse(body).cron == conf.dataDumpCron) {
        success({status: 200, message: 'Mongo dump successfully scheduled to ' + conf.dataDumpCron});
        return;
      }

      success();

    });

  });

}
