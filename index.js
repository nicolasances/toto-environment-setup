var express = require('express');
var Promise = require('promise');
var bodyParser = require("body-parser");

var postSetup = require('./dlg/PostSetup');
var postNginxRebuild = require('./dlg/PostNginxRebuild');

var apiName = 'environment-setup';

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, GoogleIdToken");
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  next();
});
app.use(bodyParser.json());
app.use(express.static('/app'));

/**
 * Smoke test api
 */
app.get('/', function(req, res) {res.send({api: apiName, status: 'running'});});

/**
 * Start the environment setup
 */
app.post('/setup', function(req, res) {

  postSetup.do(req.body).then(function(result) {
    res.status(200).send(result);
  }, function(error) {
    res.status(error.status).send(error);
  });
});

/**
 * Regenerates NGINX
 */
app.post('/nginx/builds', (req, res) => {

  postNginxRebuild.do().then((result) => {
    res.status(200).send(result);
  }, (err) => {
    res.status(err.status).send(err);
  })
})

app.listen(8080, function() {
  console.log('Toto Environment Setup Microservice up and running');
});
