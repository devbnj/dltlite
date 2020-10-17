# dltlite
dltlite is a complete full-stack, dockerized microservices package, made of
* Node.JS (latest) Flow Engine with Append-Only, Encrypted SQLite3
* SHA 512 encryption engine
* Redis (latest) Pub-Sub (modified by our engineers to run encrypted)
* Introducing APACL - asset party agreement contractual language - a new YAML construct for any blockchains. 

dltlite running on Node-RED specifies nodes (implying the libraries of code meant for Node-RED) to manage a (few) Masters and (thousands of) Workers running a replicated distributed ledger and a software based ledger-reconciliation. The distributed ledger works for any industry like financial, healthcare, hospitality, retail, insurance, manufacturing, automobile etc whose (monetary and non-monetary) transactions occur within a party-asset-agreement triangular spread. 

A cluster consisting of master node(s) can become as small as one node. Similarly, cluster of worker(s) can also be a minimum of one node. The upper limit for nodes can go up to thousands, limited by how many can take part in a business-network. It is uncertain at this time, even trying to predict setting an optimum numbers of nodes in any such private business-network, before performance or IP network degradation becomes evident. 

I will assume a ratio of 1:200 (master:workers) as a safe bet for any such business-network. Under such network, 30,000 journals can get transacted without any network degradation between simple nodes (shared micro servers) in San Francisco, Virginia, Singapore and Hong Kong. That's 200 nodes operating 25,000 miles apart.

Devb Inc, and Chainbelow Inc would appreciate any information from the community on this. Please mark any such questions / answers as issues.

# Updates 3/11/20
Demos and Configs include ledgers for
* Original
* Auction
* Lease
* Lending
* Medical Billing
* Loyalty Rewards
* Agent Commision
* Chat

# dltlite / dltlite package API
* dltlite has a rich set of REST APIs, that third-party clients can invoke. "REST" stands for Representational State Transfer. This documentation describes the various endpoints available, their invocation methods, parameters, and other details. Sample responses from the endpoints are also documented.
* We architected dltlite around three domains - party, asset and agreement. Party is the human aspect of the transaction and therefore has names and hash-ids of borrowers, lenders, attorneys, witnesses, agents, sellers. Assets are 'stuff' that get exchanged between parties. In any transaction, a party assumes the roles of a 'giver', and the other party becomes the 'taker'. Agreement is a set of policies that bind the parties to an exchange of an asset. It's like a lease agreement between the automobile buyer and the car dealer. But, there are other parties involved like attorney, witnesses, notary, etc.

* Party Data Entry through POST. Ensure you have set up the Master Node to accept HTTP and JSON posts. I have added a sample Header Entry to manage credentials, feel free to change them in your setup.
* Party Data Entry through POST. Ensure you have setup the Master Node to accept HTTP and JSON posts. I have added a sample Header Entry to manage credentials, feel free to change them in your setup.

### POST
<pre>
POST /dltlite/api/party HTTP/1.1
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
POST /dltlite/api/asset HTTP/1.1
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
POST /dltlite/api/agreement HTTP/1.1
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
GET /dltlite/api/ledger-entry HTTP/1.1
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

dltlite is &copy; Devb Inc. https://www.devb.com/. It is jointly distributed by Chainbelow Inc, a not-for profit organization.  