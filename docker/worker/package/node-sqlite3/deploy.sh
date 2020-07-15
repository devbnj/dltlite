#!/bin/bash
cd /home/devbnjhp/sqlite/node-sqlite3

echo phase 1
echo 

for server in 47.90.204.172 47.90.242.27 47.89.177.100; do
    echo deploying to ............ $server
    scp -i ~/nodejs/alikeys.pem lib/sqlite3.js root@$server:/root/.node-red/node_modules/sqlite3/lib | wait
    echo server done ................................
done

echo phase 2
echo 

for server in 47.254.84.62 47.254.67.33; do
    echo deploying to ............ $server
    scp -i ~/nodejs/tigersof.pem lib/sqlite3.js root@$server:/root/.node-red/node_modules/sqlite3/lib | wait
    echo server done ................................
done