#!/bin/bash
cd /home/devbnjhp/sqlite/sqlite-sync

echo phase 1
echo 

for server in 47.90.204.172 47.90.242.27 47.89.177.100; do
    echo deploying to ............ $server
    scp -i ~/nodejs/alikeys.pem * root@$server:/home/devb/sqlite/sqlite-sync | wait
    scp -i ~/nodejs/alikeys.pem lib/* root@$server:/home/devb/sqlite/sqlite-sync/lib | wait
    scp -i ~/nodejs/alikeys.pem nodes/* root@$server:/home/devb/sqlite/sqlite-sync/nodes | wait
    scp -i ~/nodejs/alikeys.pem app/* root@$server:/home/devb/sqlite/sqlite-sync/app | wait
    scp -i ~/nodejs/alikeys.pem ws/* root@$server:/home/devb/sqlite/sqlite-sync/ws | wait
    scp -i ~/nodejs/alikeys.pem test/* root@$server:/home/devb/sqlite/sqlite-sync/test | wait
    scp -i ~/nodejs/alikeys.pem /home/devbnjhp/.node-red/mod/* root@$server:/root/.node-red/mod
    echo server done ................................
done

echo phase 2
echo 

for server in 47.254.84.62 47.254.67.33; do
    echo deploying to ............ $server
    scp -i ~/nodejs/tigersof.pem * root@$server:/home/devb/sqlite/sqlite-sync | wait
    scp -i ~/nodejs/tigersof.pem lib/* root@$server:/home/devb/sqlite/sqlite-sync/lib | wait
    scp -i ~/nodejs/tigersof.pem nodes/* root@$server:/home/devb/sqlite/sqlite-sync/nodes | wait
    scp -i ~/nodejs/tigersof.pem app/* root@$server:/home/devb/sqlite/sqlite-sync/app | wait
    scp -i ~/nodejs/tigersof.pem ws/* root@$server:/home/devb/sqlite/sqlite-sync/ws | wait
    scp -i ~/nodejs/tigersof.pem test/* root@$server:/home/devb/sqlite/sqlite-sync/test | wait
    scp -i ~/nodejs/tigersof.pem /home/devbnjhp/.node-red/mod/* root@$server:/root/.node-red/mod
    echo server done ................................
done