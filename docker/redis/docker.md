docker build . -t node-master:1
docker pull redis
docker run --name redis -d redis
docker run -it --rm --name "node-master" node-master:1 

docker run --rm -d node:12 --network host --name "node"

docker run -it -p 1880:1880 -e FLOWS=flows_master.json -v `pwd`:/data node-master:1