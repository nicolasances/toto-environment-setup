
# Request user dockerhub credentials
read -p 'Dockerhub User: ' dockerhubUser;
read -p 'Dockerhub Pswd: ' dockerhubPassword;

# Creating required host folders
mkdir /mongo-setup;
mkdir /mongo-data;
mkdir /nginx-setup;
mkdir /tyk;

cp tyk.conf /tyk;

# Installing docker
sudo yum install -y yum-utils device-mapper-persistent-data lvm2;
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo;
sudo yum install -y docker-ce;

# Enable and start docker
systemctl enable docker;
systemctl start docker;

# Create the network for Toto
docker network create totonet;

# Building CI microservices
# 1. toto-ci-release
mkdir /toto-ci-release;
git clone https://github.com/nicolasances/toto-ci-release.git /toto-ci-release;
cd /toto-ci-release;
docker build -t nicolasances/toto-ci-release .;
docker run -d -e DOCKERHUBUSR=$dockerhubUser -e DOCKERHUBPWD=$dockerhubPassword --network totonet -v /var/run/docker.sock:/var/run/docker.sock -v $(which docker):/usr/bin/docker --name toto-ci-release nicolasances/toto-ci-release;
echo 'CI Microservice : toto-ci-release has been built';

# 2. toto-ci-api-list
mkdir /toto-ci-api-list;
git clone https://github.com/nicolasances/toto-ci-release.git /toto-ci-api-list;
cd /toto-ci-api-list;
docker build -t nicolasances/toto-ci-api-list .;
docker run -d --network totonet --name toto-ci-api-list nicolasances/toto-ci-api-list;
echo 'CI Microservice : toto-ci-api-list has been built';

# Starting this microservice
docker run -d -p 9999:8080 --network totonet -v /var/run/docker.sock:/var/run/docker.sock -v $(which docker):/usr/bin/docker -v /nginx-setup:/nginx-setup --name toto-environment-setup nicolasances/toto-environment-setup:latest;

# Now you can call http://<host>:9999/setup
echo 'You can now start the setup by POST http://<host>:9999/setup !';
