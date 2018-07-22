
# Creating required host folders
mkdir /mongo-setup;
mkdir /mongo-data;
mkdir /nginx-setup;
mkdir /tyk;

# Create the NGINX config file
touch /nginx-setup/nginx.conf;

# Installing docker
sudo yum install -y yum-utils device-mapper-persistent-data lvm2;
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo;
sudo yum install -y docker-ce;

# Enable and start docker
systemctl enable docker;
systemctl start docker;

# Create the network for Toto
docker network create totonet;

# Starting this microservice
docker run -d -p 9999:8080 --network totonet -v /var/run/docker.sock:/var/run/docker.sock -v $(which docker):/usr/bin/docker -v /nginx-setup:/nginx-setup --name toto-environment-setup nicolasances/toto-environment-setup:latest;

# Now you can call http://<host>:9999/setup
echo 'You can now start the setup by POST http://<host>:9999/setup !';
