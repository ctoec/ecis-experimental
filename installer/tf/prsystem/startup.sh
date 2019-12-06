#! /bin/bash
sudo apt-get update

#---------------------------------------
# install docker #---------------------------------------
sudo apt-get -y install docker.io
sudo systemctl start docker
sudo systemctl enable docker

sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

sudo usermod -aG docker ubuntu

#---------------------------------------
# install git
#---------------------------------------
sudo apt install git

#---------------------------------------
# install common tools
#---------------------------------------
sudo apt install build-essential
sudo apt-get -y install apt-utils

#---------------------------------------
# install apache (validate system is up)
#---------------------------------------
sudo apt-get install -y apache2
sudo systemctl start apache2
sudo systemctl enable apache2
echo "OK" | sudo tee /var/www/html/index.html

#---------------------------------------
# setup git source - hedwig
#---------------------------------------
sudo -i -u ubuntu mkdir /home/ubuntu/ws
sudo -i -u ubuntu bash -c 'cd /home/ubuntu/ws && git clone  https://github.com/ctoec/ecis-experimental'
sudo -i -u ubuntu bash -c 'cd /home/ubuntu/ws/ecis-experimental && git checkout ${github_branch}'

#---------------------------------------
# update help page with branch id
#---------------------------------------
sudo -i -u ubuntu bash -c 'sed -i "s/Build: __Build.BuildNumber__/Branch: ${github_branch}/" /home/ubuntu/ws/ecis-experimental/src/Hedwig/ClientApp/src/containers/Help/Help.tsx'

#---------------------------------------
# setup git source - winged-keys
#---------------------------------------
sudo -i -u ubuntu bash -c 'cd /home/ubuntu/ws && git clone https://github.com/ctoec/winged-keys'

#---------------------------------------
# create a bind mount - winged-keys
#---------------------------------------
sudo -u ubuntu bash -c 'cd /home/ubuntu/ws/ecis-experimental && mkdir winged-keys'
sudo mount -o bind /home/ubuntu/ws/winged-keys /home/ubuntu/ws/ecis-experimental/winged-keys

#---------------------------------------
# set config and appsettings 
#---------------------------------------
publicIP=$(curl https://checkip.amazonaws.com)
sudo -i -u ubuntu bash -c 'sed -i "s|localhost|'"$publicIP"'|g" /home/ubuntu/ws/ecis-experimental/src/Hedwig/ClientApp/public/config.json'
sudo -i -u ubuntu bash -c 'sed -i "s|localhost|'"$publicIP"'|g" /home/ubuntu/ws/winged-keys/src/WingedKeys/appsettings.Development.json'

#---------------------------------------
# Startup docker
#---------------------------------------
sudo bash -c 'cd /home/ubuntu/ws/ecis-experimental && docker-compose up --build >> /var/www/html/index.html 2>&1'

