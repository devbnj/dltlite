'use strict;'

var sqlite3 = require('./sqlite3').verbose();
var hs = require('../sqlite-sync/app/hashnsalt');

var db = new sqlite3.Database('./x.db');
var partyInput = {};
var columnPassword = "HelloWorld";
partyInput.name = "Mike Smith";
partyInput.ptype = "GIVER";
partyInput.bday = "33";
partyInput.pw = partyInput.name.replace(/\s+/g,'') + 
    partyInput.bday + columnPassword;
let hsns = hs.hashNSalt(partyInput.pw);

async function getData() {
    var res = [];
    let promise = new Promise((resolve, reject) => {    
        db.serialize(function () {
            db.run("Insert into party (name, hashid, salty, ptype) values "+
            "(?,?,?,?)", partyInput.name, hsns.passwordHash, hsns.salt, partyInput.ptype);
        })
    })

    let result = await promise;
    return result;
}

getData().then (function(data) {
    console.log(data);
});

// ===================

let mpl = msg.payload;
let hs = global.get('hashnsalt');
let assetInput = {};
assetInput.name = mpl.name;
assetInput.location = mpl.location;
var atype = 'TANGIBLE';
if (mpl.virtual) atype = 'VIRTUAL';
if (mpl.digital) atype = 'DIGITAL';
if (mpl.intangible) atype = 'INTANGIBLE';
assetInput.atype = atype;
assetInput.qty = mpl.qty;
assetInput.value = mpl.value;
assetInput.metadata = mpl.metadata;
assetInput.tag = mpl.tag;
var columnPassword = "helloworld";
assetInput.pwd = assetInput.name.replace(/\s+/g,'') + columnPassword;
let hsns = hs.hashNSalt(assetInput.pwd);

async function getData() {
    var res = [];
    let promise = new Promise((resolve, reject) => {    
        db.serialize(function () {
            db.run("INSERT INTO ASSET('HASHID','SALT','NAME','LOCATION','METADATA','ATYPE','QUANTITY','ASSET_VALUE','ASSETTAG')"+
            " VALUES (?,?,?,?,?,?,?,?,?)", hsns.passwordHash, hsns.salt, assetInput.name, assetInput.location, 
            assetInput.metadata, assetInput.atype, assetInput.qty, assetInput.value, assetInput.tag);
        })
    })

    let result = await promise;
    return result;
}

getData().then (function(data) {
    console.log(data);
});

// =========================================

let mpl = msg.payload;
let hs = global.get('hashnsalt');
let agInput = {};
agInput.name = mpl.name;
agInput.sla = mpl.sla;
var atype = 'BINDING';
if (mpl.nonbinding) atype = 'NONBINDING';
if (mpl.traceable) atype = 'TRACEABLE';
if (mpl.policy) atype = 'POLICY';
agInput.atype = atype;
agInput.warranty = mpl.warranty;
agInput.value = mpl.value;
var columnPassword = "helloworld";
agInput.pwd = agInput.name.replace(/\s+/g,'') + columnPassword;
let hsns = hs.hashNSalt(agInput.pwd);

async function getData() {
    var res = [];
    let promise = new Promise((resolve, reject) => {    
        db.serialize(function () {
            db.run("INSERT INTO AGREEMENT('HASHID','SALT','NAME','SLA','ATYPE','WARRANTY','AGREED_VALUE')"+
            " VALUES (?,?,?,?,?,?,?)", hsns.passwordHash, hsns.salt, agInput.name, agInput.sla, 
            agInput.atype, agInput.warranty, agInput.value);
        })
    })

    let result = await promise;
    return result;
}

getData().then (function(data) {
    console.log(data);
});

