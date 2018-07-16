
// Sets up the Kafka and Zookeeper services
exports.do = function() {

  return new Promise(function(success, failure) {

    // Setup the command for executing kafka
    var command = '';

    // Stop Zookeeper if running
    command += 'docker stop zookeeper || true; ';

    // Remove Zookeeper if any
    command += 'docker rm zookeeper || true; ';

    // Start zookeeper
    command += 'docker run -d -p 2181:2181 --network totonet --name zookeeper --restart always nicolasances/zookeeper; ';

    // Start Zookeeper
    exec(command, function(err, stdout, stderr) {

      if (err != null) {
        console.log(err);
        failure(err);
        return;
      }

      // Setup the command for kafka
      var kafkaCmd = '';

      // Stop Kafka if running
      kafkaCmd += 'docker stop kafka || true; ';

      // Remove Kafka if any
      kafkaCmd += 'docker rm kafka || true; ';

      // Start Kafka
      kafkaCmd += 'docker run -d -p 9092:9092 --network totonet --restart always --name kafka nicolasances/kafka; ';

      exec(kafkaCmd, function(err, stdout, stderr) {

        if (err != null) {
          console.log(err);
          failure(err);
          return;
        }

        success();

      });

    });

  });

}
