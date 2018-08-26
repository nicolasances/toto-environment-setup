# Toto Environment Setup

This service helps setting up a Toto Environment (dev, test, prod, ...).

## Setting up a Toto environment

Once you have a VM **with CentOS**, the first step is to launch the `init.sh` script.
This script will:
 * Create the necessary folders on the VM
 * Install Docker CE
 * Enable and start the Docker service
 * Create the required Docker networks
 * Start the Toto CI microservices
 * Start the `toto-environment-setup` microservice (listens on 9999)

To launch the script:

    sh init.sh

The script will ask for the Dockerhub username and password.
The script will also ask for the user and pswd to protect the APIs.

## Using the toto-environment-setup microservice

To setup the rest of the Toto environment, just call the toto-enviroment-setup API:

    POST http(s)://<host>:9999/setup

The payload that has to be passed is the following:

    {
      "env": "dev" or "prod",
      "ssl" : true/false (to configure SSL)
      "host": name or IP address of the host,
      "dataDumpCron": e.g. "0 */3 * * *"
    }

In case of **SSL configuration** you will first need to create the certificates.
The certificates will have to be **generated through Let's Encrypt** and stored at `/etc/letsencrypt/archive/<host name>/`.
