
var exec = require('child_process').exec;

// Sets up the Kafka and Zookeeper services
exports.do = function() {

  return new Promise(function(success, failure) {

    console.log("Kafka : starting set up ...");

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
      kafkaCmd += 'docker rm kafka || true; ';
      kafkaCmd += 'docker rmi nicolasances/kafka || true; ';

      // Download and build Kafka
      kafkaCmd += 'rm -r /kafka || true; ';
      kafkaCmd += 'git clone https://github.com/nicolasances/toto-kafka.git /kafka; ';
      kafkaCmd += 'docker build -t nicolasances/kafka /kafka; ';

      // Start Kafka
      kafkaCmd += 'docker run -d -p 9092:9092 --network totonet --restart always --name kafka nicolasances/kafka; ';

      exec(kafkaCmd, function(err, stdout, stderr) {

        if (err != null) {
          console.log(err);
          failure(err);
          return;
        }

        console.log("Kafka : setup complete!");

        success();

      });

    });

  });

}
