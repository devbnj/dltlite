# Master
docker build . -t node-master:1
docker run -it -p 1880:1880 --name "node" node-master:1
docker run -it -p 1880:1880 --network host --name "node" -e FLOWS=flows_master.json -v `pwd`:/data node-master:1
# docker pull redis

# Redis
docker build . -t redis:1
docker run --network host --name redis -d redis:1


# Headless Node-RED
docker run -d -p 1880:1880 --name mynodered nodered/node-red
docker exec -it mynodered /bin/bash

docker run -it --rm --name "node-master" node-master:1 

docker run --rm -d node:12 --network host --name "node"

===================================

sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/lib/node_modules
sudo chown -R $USER /usr/local/lib/node_modules

npm i -g node-pre-gyp@0.14.0