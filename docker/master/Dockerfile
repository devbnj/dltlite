FROM nodered/node-red

USER node-red
COPY --chown=node-red:node-red . /data/

COPY --chown=node-red:node-red package.json .
USER node-red
RUN npm install --unsafe-perm --no-update-notifier --no-fund --only=production
USER node-red


USER node-red
COPY --chown=node-red:node-red mod/dlcrypto.js /data/mod/dlcrypto.js
COPY --chown=node-red:node-red mod/hashnsalt.js /data/mod/hashnsalt.js

EXPOSE 2880
