# Toto Environment Setup

This service helps setting up a Toto Environment (dev, test, prod, ...).

## Setting up a Toto environment

Once you have a VM **with CentOS**, the first step is to launch the `init.sh` script.
This script will:
 * Install the letsencrypt certificates
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
The script will also ask for the server host and environment (dev or prod).

## Using the toto-environment-setup microservice

To setup the rest of the Toto environment, just call the toto-enviroment-setup API: <br/>
`POST http(s)://<host>:9999/setup`

The payload that has to be passed is the following: <br/>
`{"dataDumpCron": "0 */3 * * *"}`

Example:
```
curl -X POST  http://imatzdev.it:9999/setup -H 'Content-Type: application/json' -d '{"dataDumpCron": "0 */3 * * *"}'
```

***Note*** <br/>
The certificates will have been **generated through Let's Encrypt** and stored at `/etc/letsencrypt/archive/<host name>/`.
