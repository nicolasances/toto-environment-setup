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

    sh init.sh <dockerhub username> <dockerhub pswd>

## Using the toto-environment-setup microservice

To setup the rest of the Toto environment, just call the toto-enviroment-setup API:

    POST http(s)://<host>:9999/setup

The payload that has to be passed is the following:

    {
      ssl : true/false (to configure SSL)
      host: the name of the host that will be used for the SSL configuration
    }

In case of **SSL configuration** you will first need to create the certificates.
The certificates will have to be **generated through Let's Encrypt** and stored at `/etc/letsencrypt/archive/<host name>/`.
