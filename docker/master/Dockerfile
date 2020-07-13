FROM nodered/node-red

# Copy package.json to the WORKDIR so npm builds all
# of your added nodes modules for Node-RED
USER node-red
COPY package.json .

# Copy _your_ Node-RED project files into place
# NOTE: This will only work if you DO NOT later mount /data as an external volume.
#       If you need to use an external volume for persistence then
#       copy your settings and flows files to that volume instead.
# COPY settings.js /data/settings.js
# COPY flows_master.json /data/flows_master.json
# RUN mkdir /data/mod
COPY mod/dlcrypto.js /data/mod/dlcrypto.js
COPY mod/hashnsalt.js /data/mode/hashnsalt.js
# RUN mkdir -p /data/sqlite-sync
# RUN mkdir -p /data/node-sqlite3
# RUN mkdir -p /data/sqlite-sync/app
# RUN mkdir -p /data/sqlite-sync/nodes
# RUN mkdir -p /data/sqlite-sync/nodes/icons
# RUN mkdir -p /data/sqlite-sync/lib
# COPY package/sqlite-sync/package.json /data/sqlite-sync/package.json
# COPY package/sqlite-sync/app/* /data/sqlite-sync/app/
# COPY package/sqlite-sync/lib/* /data/sqlite-sync/lib/
# COPY package/sqlite-sync/nodes/* /data/sqlite-sync/nodes/
# COPY package/sqlite-sync/nodes/icons/* /data/sqlite-sync/nodes/icons/

RUN npm install --unsafe-perm --no-update-notifier --no-fund --only=production

