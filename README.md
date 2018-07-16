# Toto Environment Setup

This service helps setting up a Toto Environment (dev, test, prod, ...).

## Setting up a Toto environment

Once you have a VM **with CentOS**, the first step is to launch the `init.sh` script.
This script will:
 * Create the necessary folders on the VM
 * Install Docker CE
 * Enable and start the Docker service
 * Create the required Docker networks
 * Starting the `toto-environment-setup` microservice (listens on 9999)

## Using the toto-environment-setup microservice

To setup the rest of the Toto environment, just call the toto-enviroment-setup API:

    POST http(s)://<host>:9999/setup
