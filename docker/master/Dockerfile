FROM nodered/node-red

# Copy package.json to the WORKDIR so npm builds all
# of your added nodes modules for Node-RED
COPY package.json .

# Copy _your_ Node-RED project files into place
# NOTE: This will only work if you DO NOT later mount /data as an external volume.
#       If you need to use an external volume for persistence then
#       copy your settings and flows files to that volume instead.
COPY settings.js /data/settings.js
COPY flows_master.json /data/flows_master.json
RUN mkdir /data/mod
COPY mod/dlcrypto.js /data/mod/dlcrypto.js
COPY mod/hashnsalt.js /data/mode/hashnsalt.js
RUN mkdir -p /data/sqlite-sync
RUN mkdir -p /data/node-sqlite3
RUN mkdir -p /data/sqlite-sync/app
RUN mkdir -p /data/sqlite-sync/nodes
RUN mkdir -p /data/sqlite-sync/nodes/icons
RUN mkdir -p /data/sqlite-sync/lib
COPY package/sqlite-sync/package.json /data/sqlite-sync/package.json
COPY package/sqlite-sync/app/* /data/sqlite-sync/app/
COPY package/sqlite-sync/lib/* /data/sqlite-sync/lib/
COPY package/sqlite-sync/nodes/* /data/sqlite-sync/nodes/
COPY package/sqlite-sync/nodes/icons/* /data/sqlite-sync/nodes/icons/

RUN npm install --unsafe-perm --no-update-notifier --no-fund --only=production

# You should add extra nodes via your package.json file but you can also add them here:
#WORKDIR /usr/src/node-red
#RUN npm install node-red-node-smooth

# FROM node:12
# RUN mkdir /root/.node-red
# WORKDIR /app
# RUN apt-get update -y
# apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates
# RUN npm install -g --unsafe-perm node-red
# COPY package*.json /app
# COPY flows_master.json /app
# COPY settings.js ./
# RUN mkdir /app/mod/
# COPY mod/dlcrypto.js /app/mod/dlcrypto.js
# COPY mod/hashnsalt.js /app/mode/hashnsalt.js

# EXPOSE 1880
# CMD [ "node-red", "-s settings.js", "flows_master.json" ]
