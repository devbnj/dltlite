# dblite
dblite is a complete full-stack, microservices package, made of 
* Flow Engine with Append Only SQLite3, 
* SHA 512 encryption engine,
* Redis Pub-Sub, 
* DBlite (Node-RED) Nodes 
to manage a (Few)Masters-(Many)Workers Distributed Ledger and Reconciliation system. 

Master(s) can be as little as 1 node. Worker(s) can be a minimum of 1 node. Nodes can go upto thousands. It is uncertain at this time to accurately state what the optimum numbers are before any performance degradation is noticed. Devb Inc and Chainbelow would appreciate any inputs from the community on this. Please mark them as issues.

# Working with different Cloud Providers

* Installations with two cloud providers are shown here, namely Alibaba Cloud and AWS.
* First installation is on new Ubuntu 18.0.4 instances in Alibaba Cloud on their 6th gen ECS instances. Please note - dblite has not been tried with the new Aliyun Linux. 
* Minimum two EC2/ECS instances are required. In this README, the IP addresses have been masked to ensure their protection. | 47.xxx.xx.62 | 47.xxx.xx.33 |.
* The next step requires you to set up security controls, obtain the pem file from the console and restart the servers.

## Alibaba Cloud ECS instances 
* Accessing the worker node from a local machine

<code>
$ ssh -i ~/[instance-key].pem root@47.xxx.xx.62
</code>

* Accessing the master node

<code>
$ ssh -i ~/[instance-key].pem root@47.xxx.xx.33
</code>

* Adding a new user, who has sudo rights
<pre>
<code>
$ adduser devb
$ usermod -aG sudo devb
$ su - devb
</code>
</pre>

## Development
* To develop and implement dblite, you must install Node.JS, and Node-RED along with a few other components.

### Installing Node.js and Node-RED in the Ubuntu instances
<pre>
<code>
$ cd ~
$ sudo apt update
$ sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates
$ curl -sL https://deb.nodesource.com/setup_10.x | sudo bash
$ sudo apt-get install -y nodejs
$ sudo npm install -g --unsafe-perm node-red
</code>
</pre>

### Upgrade Node.js through N 
<pre>
<code>
$ sudo npm install -g n
$ n 10.16.0
$ n lts
</code>
</pre>

* To use a default node.js version, just type 'n'
* To remove other cached versions:

<code>
$ n rm 0.9.4 v0.10.0
</code>

* Remove other cached versions except the current version:

<code>
$ n prune
</code>

## Downloading and building redis
<pre>
<code>
$ wget http://download.redis.io/releases/redis-5.0.5.tar.gz
$ tar xzf redis-5.0.5.tar.gz
$ cd redis-5.0.5
$ make
</code>
</pre>

## Or, you can download Redis directly

<code>
$ apt-get install redis-server
</code>

## Configuring Redis

<code>
$ ./redis-server redis.conf
</code>

## Redis - redis.config file
<pre>
bind 127.0.0.1
bind 0.0.0.0
tcp-keepalive 300
</pre>

## Install NGINX

<pre>
<code>
$ sudo apt update
$ sudo apt install nginx
</code>
</pre>

## Check the NGINX installation
<pre>
<code>
$ sudo systemctl status nginx
$ sudo chown -R $USER:$USER /var/www
</code>
</pre>

## Setting up a firewall
<pre>
<code>
$ sudo ufw allow 80/tcp
$ sudo ufw allow 443/tcp
$ sudo ufw reload
</code>
</pre>

## Configure Nginx for reverse proxy
<pre>
<code>
$ cd /etc/nginx/sites-enabled
$ nano default
</code>
</pre>

## Adding the 'location' to the appropriate NGINX config file
<pre>
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
</pre>

## For the master
<pre>
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
</pre>        

## Restarting NGINX to ensure all changes 
<code>
$ sudo systemctl restart nginx
</code>

## or
<code>
$ service nginx restart
</code>

## Installing the dblite packages
* If .node-red folder does not exist, run node-red and the folder will be created. This goes for both master and worker
<pre>
<code>
$ cp [install-dir] * [to] ~/sqlite/sqlite-sync
$ cp [install-dir] * [to] ~/sqlite/sqlite-sync

$ cd ~/.node-red
$ npm i sqlite3
$ npm install ~/sqlite/sqlite-sync
$ npm install ~/sqlite/dblite
</code>
</pre>

## For the .node-red folder in both master and worker nodes
<pre>
<code>
$ cp [install-dir]/dotnode-red/mod/* ~/.node-red/mod/
$ cp [install-dir]/dotnode-red/* ~/.node-red/
</code>
</pre>

## Now you can run node-red [the dataknox package] with all the changes
## Even better, run node-red under PM2
<pre>
<code>
$ npm install -g pm2
$ pm2 start /usr/bin/node-red -- -v
</code>
</pre>


## Check the logs to ensure your web-app is properly installed
<code>
$ cat /var/log/nginx/access.log
</code>

## Dashboard and other changes
<pre>
<code>
$ cd ~/.node-red
$ npm install node-red-dashboard
</code>
</pre>

## Sqite3 Node.js build
<pre>
<code>
$ cd node-sqlite3
$ npm install --build-from-source --sqlite_magic="[your magic phrase]"

$ npm config set user 0
$ npm config set unsafe-perm true

$ npm install sqlite3 --build-from-source --sqlite=/usr/devbnjhp/sqlite/sqlite-src --sqlite_magic="[your magic phrase]" --save-dev
</pre>
</code>

# Installing in AWS ec2 or lightsail instances
* We installed in the ec2 Amazon Linux instance (master and node) 
<pre>
<code>
$ chmod 400 ~/[aws-access].pem
$ ssh -i ~/[aws-access].pem ec2-user@ec2-35-xxx-xxx-108.compute-1.amazonaws.com
</pre>
</code>

## ec2 Instance 2
<pre>
<code>
$ ssh -i ~/[aws-access].pem ec2-user@ec2-34-xxx-xxx-242.compute-1.amazonaws.com
</pre>
</code>

### Install node-js 10 or LTS
<pre>
<code>
$ sudo yum update
$ sudo yum install -y gcc gcc-c++ make openssl-devel
$ curl --silent --location https://rpm.nodesource.com/setup_10.x | sudo bash -
$ sudo yum -y install nodejs
</pre>
</code>

### Install node red
<pre>
<code>
$ sudo npm install -g --unsafe-perm node-red
</pre>
</code>

### Install nginx
<pre>
<code>
$ sudo amazon-linux-extras install nginx1.12 -y
$ sudo systemctl status nginx
$ sudo systemctl start nginx
$ sudo nano /etc/nginx/nginx.conf
</pre>
</code>

<pre>
        location /nodeadmin/ {
                proxy_pass http://localhost:1880/; 
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header X-Real-IP $remote_addr;
        }
</pre>

### Install packages in node-red
<pre>
<code>
$ cd .node-red
$ npm install ~/sqlite/sqlite-sync
$ npm install node-red-dashboard
$ npm install sqlite3
$ npm install text-encoding
</pre>
</code>

### Install dblite
<pre>
<code>
$ cd ~/sqlite/sqlite-sync
$ npm install ~/sqlite/sqlite-sync
</pre>
</code>

## Download and build redis
<pre>
<code>
$ wget http://download.redis.io/releases/redis-5.0.5.tar.gz
$ tar xzf redis-5.0.5.tar.gz
$ cd redis-5.0.5
$ make
</pre>
</code>

## Configure redis
<pre>
<code>
$ cd src
$ nano or [vim] redis.conf
</pre>
</code>

## Redis - redis.config file
<pre>
bind 172.31.39.21
bind 127.0.0.1
bind 0.0.0.0
tcp-keepalive 300
requirepass 
rename-command CONFIG ""
rename-command FLUSHALL ""
rename-command FLUSHDB ""
</pre>

## Run Redis with the config
<pre>
<code>
$ ./redis-server redis.conf
</pre>
</code>

### Rebuild npm for sqlite3
<pre>
<code>
$ npm install --build-from-source --sqlite_magic="[your magic phrase]"

$ npm install --build-from-source --sqlite=/usr/devbnjhp/sqlite/sqlite-src/ --sqlite_magic="[Your magic phrase]"
</pre>
</code>

# DataKnox (dblite package) API
* About REST APIs - "REST" stands for Representational State Transfer. In this documentation, I will describe the various endpoints available, their methods, parameters, and other details, and you also document sample responses from the endpoints.  
* Party Data Entry through POST. Ensure you have setup the Master Node to accept HTTP and JSON posts. I have added a sample Header Entry to manage credentials, feel free to change them in your setup.

### POST
<pre>
POST /dataknox/api/party HTTP/1.1
Host: 47.xxx.xx.33
Content-Type: application/json
entry: xyz
Cache-Control: no-cache
</pre>

* Headers
<pre>
Content-Type:application/json
entry:xyz
</pre>

* JSON Data
<pre>
<code>
{"partyname":"John Sire","stdate":"1976-03-02","endate":"","type":"Taker"}
</code>
</pre>

## Asset Data Entry
* POST
<pre>
<code>
POST /dataknox/api/asset HTTP/1.1
Host: 47.xxx.xx.33
Content-Type: application/json
entry: xyz
Cache-Control: no-cache
Postman-Token: f2dce699-5f13-894d-54bd-a4226e5c155c
</pre>
</code>

* Headers as above
* Data
<pre>
<code>
{"name":"windy1","location":"Sparta, New Jersey","metadata":"","qty":"1","value":"100000","atype":"Tangible"}
</pre>
</code>

## Agreement Data Entry
### POST
<pre>
<code>
POST /dataknox/api/agreement HTTP/1.1
Host: 47.xxx.xx.33
Content-Type: application/json
entry: xyz
Cache-Control: no-cache
Postman-Token: af47f163-3578-4b23-a599-12fd3e1ba6a9

{"name":"Devbnj","sla":"Immediate","warranty":"Limited","agreed_value":"82000","agtype":"Binding","p_value":"92000","settle":"CASH"}
</pre>
</code>

## Get Party, Asset, Agreement for Ledger Journal preparation
### GET
<pre>
<code>
GET /dataknox/api/ledger-entry HTTP/1.1
Host: 47.xxx.xx.33
Content-Type: application/json
entry: xyz
Cache-Control: no-cache
Postman-Token: caea1a7d-ff85-bd63-ec9d-d4f9b243e085
</pre>
</code>

#### Response
<pre>
<code>
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
</pre>
</code>

dblight, packaged and distributed also as dataKnox is &copy; Devb Inc. https://www.devb.com/. It is distributed by Chainbelow Inc, a not-for profit organization. dblight and dataknox is distributed under a limited GPL license. If you or a entity/corporation is using it for any commercial purposes, a commercial license applies. DataKnox is commercially marketed through Alontrus Group (USA) and DataKnox is supported by eSynergy (India). 