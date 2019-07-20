# Uninstall previous versions
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine \
                  docker-ce;

rm -rf /var/lib/docker;

# Request user dockerhub credentials
echo 'Dockerhub configuration'
echo
read -p 'Dockerhub User: ' dockerhubUser;
read -p 'Dockerhub Pswd: ' -s dockerhubPassword;
echo

echo 'Toto API security configuration'
echo
read -p 'Toto API User: ' totoApiUser;
read -p 'Toto API Pswd: ' -s totoApiPswd;

echo 'Server info'
echo
read -p 'Environment (dev or prod): ' serverEnv;
read -p 'Host (only ip or dns name, no http:// and no port): ' serverHost;
read -p 'SSL? (true or false): ' serverSSL;
echo

# Install PubSub
rm -rf /keys;
mkdir /keys;
sudo git clone https://totoances@bitbucket.org/totoances/toto-events-$serverEnv.git /keys;

# Install Certificates
sudo git clone https://github.com/letsencrypt/letsencrypt /opt/letsencrypt;

sudo -H /opt/letsencrypt/letsencrypt-auto certonly --standalone -d $serverHost

# Creating required host folders
rm -rf /mongo-setup;
rm -rf /mongo-data;
rm -rf /nginx-setup;
rm -rf /tyk;

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

# login
docker login -u $dockerhubUser -p $dockerhubPassword

# Building toto-environment-setup
git pull;
docker build -t nicolasances/toto-environment-setup .;
docker push nicolasances/toto-environment-setup;

# Building CI microservices
# 1. toto-ci-release
rm -rf /toto-ci-release;
mkdir /toto-ci-release;
git clone https://github.com/nicolasances/toto-ci-release.git /toto-ci-release;
cd /toto-ci-release;
docker build -t nicolasances/toto-ci-release .;
docker run -d --restart always -e SERVERSSL=$serverSSL -e SERVERENV=$serverEnv -e SERVERHOST=$serverHost -e TOTOAPIUSER=$totoApiUser -e TOTOAPIPSWD=$totoApiPswd -e DOCKERHUBUSR=$dockerhubUser -e DOCKERHUBPWD=$dockerhubPassword --network totonet -v /var/run/docker.sock:/var/run/docker.sock -v $(which docker):/usr/bin/docker -v /nginx-setup:/nginx-setup --name toto-ci-release nicolasances/toto-ci-release;
echo 'CI Microservice : toto-ci-release has been built';

# 2. toto-ci-api-list
rm -rf /toto-ci-api-list;
mkdir /toto-ci-api-list;
git clone https://github.com/nicolasances/toto-ci-api-list.git /toto-ci-api-list;
cd /toto-ci-api-list;
docker build -t nicolasances/toto-ci-api-list .;
docker run -d --restart always --network totonet --name toto-ci-api-list nicolasances/toto-ci-api-list;
echo 'CI Microservice : toto-ci-api-list has been built';

# Starting this microservice
docker run -d -p 9999:8080 --network totonet -e SERVERSSL=$serverSSL -e SERVERENV=$serverEnv -e SERVERHOST=$serverHost -e TOTOAPIUSER=$totoApiUser -e TOTOAPIPSWD=$totoApiPswd -v /var/run/docker.sock:/var/run/docker.sock -v $(which docker):/usr/bin/docker -v /nginx-setup:/nginx-setup --name toto-environment-setup nicolasances/toto-environment-setup:latest;

# Now you can call http://<host>:9999/setup
echo 'You can now start the setup by POST http://<host>:9999/setup !';
