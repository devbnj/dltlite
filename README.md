# dblite
DBLite comprises a 
* Flow Engine with Append Only SQLite3, 
* Redis Pub-Sub, 
* DBlite (Node-RED) Nodes 
to manage a (Few)Masters-(Many)Workers Distributed Ledger and Reconciliation system. 

# Working with different Cloud Providers
Installations with two cloud providers are shown here, namely Alibaba Cloud and AWS.
First installation is on new Ubuntu 18.0.4 instances in Alibaba Cloud on their 6th gen ECS instances. Please note - dblite has not been tried with the new Aliyun Linux. Minimum two EC2/ECS instances are required. In this README, the IP addresses have been masked to ensure their protection. | 47.xxx.xx.62 | 47.xxx.xx.33 |.

The next step requires you to set up security controls, obtain the pem file from the console and restart the servers.

## New instances 
### Access worker node from local instance
<code>
$ ssh -i ~/[instance-key].pem root@47.xxx.xx.62
</code>
### master node
<code>
$ ssh -i ~/[instance-key].pem root@47.xxx.xx.33
</code>

### Add a new user
<code>
$ adduser devb
$ usermod -aG sudo devb
$ su - devb
</code>

## Development
To develop and implement dblite, you must install Node.JS, and Node-RED along with a few other components.

### Install Node.js and Node-RED
<code>
$ cd ~
$ sudo apt update
$ sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates
$ curl -sL https://deb.nodesource.com/setup_10.x | sudo bash
$ sudo apt-get install -y nodejs
$ sudo npm install -g --unsafe-perm node-red
</code>

### Upgrade Node.js through N 
<code>
$ sudo npm install -g n
$ n 10.16.0
$ n lts
</code>

#### To use a default node, just type n
#### Remove other cached versions:
$ n rm 0.9.4 v0.10.0

#### Remove all cached versions except the current version:
$ n prune

## Download and build redis
$ wget http://download.redis.io/releases/redis-5.0.5.tar.gz
$ tar xzf redis-5.0.5.tar.gz
$ cd redis-5.0.5
$ make

## Or, you can download Redis
$ apt-get install redis-server

## Configure Redis
$ ./redis-server redis.conf

## Redis - redis.config file
bind 127.0.0.1
bind 0.0.0.0
tcp-keepalive 300

## Install NGINX
$ sudo apt update
$ sudo apt install nginx
## Check nginx
$ sudo systemctl status nginx
$ sudo chown -R $USER:$USER /var/www
## If firewall
$ sudo ufw allow 80/tcp
$ sudo ufw allow 443/tcp
$ sudo ufw reload

## Configure Nginx for reverse proxy
$ cd /etc/nginx/sites-enabled
$ nano default

## Add the location to the appropriate NGINX config file
=========================================
        location /nodeadmin/ {
                proxy_pass http://localhost:1880/; 
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header X-Real-IP $remote_addr;
        }

        location /dataknox/ {
                proxy_pass http://localhost:1880/ui/;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header X-Real-IP $remote_addr;
        }

## or for the master

        location /dataknox/ {
                proxy_pass http://localhost:1880/master/;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header X-Real-IP $remote_addr;
        }

        location /config/ {
                proxy_pass http://localhost:1880/config/;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header X-Real-IP $remote_addr;
        }
=========================================

## Restart NGINX
$ sudo systemctl restart nginx
## or
$ service nginx restart

## Install the packages
###### If .node-red folder does not exist, run node-red and it will be created. This goes for both master and worker
$ cp [install-dir] * [to] ~/sqlite/sqlite-sync
$ cp [install-dir] * [to] ~/sqlite/sqlite-sync

$ cd ~/.node-red
$ npm i sqlite3
$ npm install ~/sqlite/sqlite-sync
$ npm install ~/sqlite/dblite

## For .node-red folder
$ cp [install-dir]/dotnode-red/mod/* ~/.node-red/mod/
$ cp [install-dir]/dotnode-red/* ~/.node-red/

## Now you can run node-red with the new installation
## Even better, run node-red under PM2

$ npm install -g pm2
$ pm2 start /usr/bin/node-red -- -v

## Check the logs to ensure your web-app is properly installed
$ cat /var/log/nginx/access.log

## Dashboard and other changes
$ cd ~/.node-red
$ npm install node-red-dashboard

## Sqite3 Node.js build
$ cd node-sqlite3
$ npm install --build-from-source --sqlite_magic="[your magic phrase]"

$ npm config set user 0
$ npm config set unsafe-perm true

$ npm install sqlite3 --build-from-source --sqlite=/usr/devbnjhp/sqlite/sqlite-src --sqlite_magic="[your magic phrase]" --save-dev

# Installing in AWS
## ec2 Instance 1 in aws instances Amazon Linux
$ chmod 400 ~/[aws-access].pem
$ ssh -i ~/[aws-access].pem ec2-user@ec2-35-xxx-xxx-108.compute-1.amazonaws.com

## ec2 Instance 2
$ ssh -i ~/[aws-access].pem ec2-user@ec2-34-xxx-xxx-242.compute-1.amazonaws.com

### Install node-js 10
$ sudo yum update
$ sudo yum install -y gcc gcc-c++ make openssl-devel
$ curl --silent --location https://rpm.nodesource.com/setup_10.x | sudo bash -
$ sudo yum -y install nodejs

### Install node red
$ sudo npm install -g --unsafe-perm node-red

### Install nginx
$ sudo amazon-linux-extras install nginx1.12 -y
$ sudo systemctl status nginx
$ sudo systemctl start nginx
$ sudo nano /etc/nginx/nginx.conf

=====================================
        location /nodeadmin/ {
                proxy_pass http://localhost:1880/; 
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header X-Real-IP $remote_addr;
        }
=====================================

### Install packages in node-red
$ cd .node-red
$ npm install ~/sqlite/sqlite-sync
$ npm install node-red-dashboard
$ npm install sqlite3
$ npm install text-encoding

### Install dblite
$ cd ~/sqlite/sqlite-sync
$ npm install ~/sqlite/sqlite-sync

## Download and build redis
$ wget http://download.redis.io/releases/redis-5.0.5.tar.gz
$ tar xzf redis-5.0.5.tar.gz
$ cd redis-5.0.5
$ make

## Configure redis
$ cd src
$ nano or [vim] redis.conf

## Redis - redis.config file
bind 172.31.39.21
bind 127.0.0.1
bind 0.0.0.0
tcp-keepalive 300
requirepass 
rename-command CONFIG ""
rename-command FLUSHALL ""
rename-command FLUSHDB ""

## Run Redis with the config
$ ./redis-server redis.conf

### Rebuild npm for sqlite3
$ npm install --build-from-source --sqlite_magic="[your magic phrase]"

$ npm install --build-from-source --sqlite=/usr/devbnjhp/sqlite/sqlite-src/ --sqlite_magic="[Your magic phrase]"

# DataKnox (dblite package) API
## Party Entry
### POST
POST /dataknox/api/party HTTP/1.1
Host: 47.xxx.xx.33
Content-Type: application/json
entry: xyz
Cache-Control: no-cache

#### Headers
Content-Type:application/json
entry:xyz

#### Data
{"partyname":"John Sire","stdate":"1976-03-02","endate":"","type":"Taker"}

## Asset Entry
### POST

POST /dataknox/api/asset HTTP/1.1
Host: 47.xxx.xx.33
Content-Type: application/json
entry: xyz
Cache-Control: no-cache
Postman-Token: f2dce699-5f13-894d-54bd-a4226e5c155c

#### Headers
As above

#### Data
{"name":"windy1","location":"Sparta, New Jersey","metadata":"","qty":"1","value":"100000","atype":"Tangible"}

## Agreement Entry
### POST

POST /dataknox/api/agreement HTTP/1.1
Host: 47.xxx.xx.33
Content-Type: application/json
entry: xyz
Cache-Control: no-cache
Postman-Token: af47f163-3578-4b23-a599-12fd3e1ba6a9

{"name":"Devbnj","sla":"Immediate","warranty":"Limited","agreed_value":"82000","agtype":"Binding","p_value":"92000","settle":"CASH"}

## Get Party, Asset, Agreement for Entry
### GET

GET /dataknox/api/ledger-entry HTTP/1.1
Host: 47.xxx.xx.33
Content-Type: application/json
entry: xyz
Cache-Control: no-cache
Postman-Token: caea1a7d-ff85-bd63-ec9d-d4f9b243e085

#### Response
{
    "party": [
        {
            "NAME": "mike",
            "HASHID": "e015bafdb9d42f54e97aa5a79465fd59955f12e65cd3777bae7e26b448ab9109c4007c46df3e8d0a1eca74b1832dc12d9aea3064c6e7ae25a1417e6d8515869d"
        },
        {
            "NAME": "ralph",
            "HASHID": "3ec15210b13fe4e140ddb879a0f16790c86234a0063a838723c9b856f9ee7610b0252e3800f0714fdebe6a452a4648f0f6905b9af4d004956dd7c72aa8a97585"
        },
        {
            "NAME": "tom",
            "HASHID": "1be98d84379f3ab9ec439e6768599a0dd4ab0622b960f4867b660549145ad39455cc7254558d873e1afe3eff6048911a2991dde29cc2b9138773522e186a4d51"
        },
        {
            "NAME": "John Guire",
            "HASHID": "aff15a3d98e0bb80d4e36c5ef23d002c2e66f45befa59fa2c74e60ace104e67fb7350cb15d3edfc3e50d97bfc2a48a32589e4a265515a2b515828a4e67547ea5"
        },
        {
            "NAME": "John Suire",
            "HASHID": "e521958efe7d2fbf958c9e515406fee9bc08fb3c4c93e43df488b911a1f0e5929f177f24da0328a4ffa74ee32019beaa78ff7afd0aa16a09ee2ba62d82cb5dbf"
        },
        {
            "NAME": "John Suire",
            "HASHID": "7f6c50ef3d032543a6f6820e6b56824ff89afdeda69ea1dd36f0542c035f5436532c48670b184f3919b231775358aca71b6304f256df6fe2560efee495da8801"
        },
        {
            "NAME": "John Fire",
            "HASHID": "513e6aee3c8a3664cef855208adcaf9a5f27acb56252dac87fa5d690232782c02d34413e3f5acd82678152cbd9a00b5abfeec9c3b3a6dc5e9dd067eef36c9a2b"
        },
        {
            "NAME": "John Fire",
            "HASHID": "873ea2935a624c19d5b2bad7b7bcf4d52845cb5078db59ee6e557888f483f67051b74148fc7bd6c45a028f8ad16c72ac620574d5880a443ad52c976805d2235c"
        },
        {
            "NAME": "John Fire",
            "HASHID": "92f17fbc99e620cd32b62370e0407f00ab1736e11d2474c7321736bf937d1402080f99fe3beb6122dcdf652b2458993a6794745283181f2fb1ac652c0d8f38f3"
        },
        {
            "NAME": "John Tire",
            "HASHID": "ec082e800df15db3526c27af7651f218084485dbcc97287a894342abd5ab329a64e193c3ca17fc777cd357dc871ba7f595c0faa60f78f7c36c0510d3de0e5cfd"
        }
    ],
    "agree": [
        {
            "NAME": "truck sale",
            "HASHID": "37967f48c55c2167207c76988160b1131e574f7fc75a67ecb09a092ec1c23ab0503a4fd59695576c6b43ec151eae8a6aa5a5fedf7422ae8687d0073bb0c91e12"
        },
        {
            "NAME": "Devbnj",
            "HASHID": "30f01530d916a749499da7d2fb09e2404e14df5cbd6a99b20011ab4c8c2613800221cd7127af49dff26c1d8f86232cf2a7a44d879e2ba743a0634e518f55c7a7"
        }
    ],
    "asset": [
        {
            "NAME": "truck sale",
            "HASHID": "b383ff74b5425a65f6208053fb2ec846c656fb1429cd97cf7452d0848fbc85e07ec4a4a1cb15638292b40126f1ca56ed71276bf2d51b45ffb089a30cc0990ba1"
        },
        {
            "NAME": "windy1",
            "HASHID": "055da7b50c54062c1b15a0780579ab4f51a5ec936a61bff26a80d77f898c83c622f6fcf06531394559a07bcd7f1e5df6f514a0e817c762987971e857785af3a3"
        }
    ]
}
