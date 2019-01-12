var setupAPIGateway = require('./SetupAPIGateway');

/**
 * Retrieves the user hash
 */
exports.do = function() {

  return new Promise(function(success, failure) {

    success({key: setupAPIGateway.getUserKey()});

  });
}
