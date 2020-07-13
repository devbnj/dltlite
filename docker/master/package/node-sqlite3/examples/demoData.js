'use strict';
// =========== For Node-Red
// var pld = msg.payload;

/*
var hs = global.get('hashnsalt');
var dblite3 = global.get('dblite3').verbose();
var db = new dblite3.Database('./lgr.db');
*/
// ============ For CLI
var sqlite3 = require('../sqlite3');
var db = new sqlite3.Database('./lgr.db');
var hs = require("../othlib/hashnsalt");

console.log ('Creating DataKnox Tables, Populating them 20,000 ledger transactions');
var d = new Date();
var n = d.getTime();
// console.log ('Start time', n);

db.serialize(function () {
    var sqlddl = "CREATE TABLE IF NOT EXISTS PARTY(ID " +
        "INTEGER PRIMARY KEY AUTOINCREMENT, HASHID TEXT UNIQUE, " +
        "SALT TEXT, NAME TEXT NOT NULL, PTYPE TEXT " +
        "CHECK (PTYPE IN ('GIVER','TAKER','WITNESS','ATTORNEY', " +
        "'THIRDPARTY','REFEREE')), STDATE DATETIME DEFAULT CURRENT_TIMESTAMP, " +
        "ENDDATE DATETIME); ";
    db.run(sqlddl);
    sqlddl = "CREATE TABLE IF NOT EXISTS ASSET(ID " +
        "INTEGER PRIMARY KEY AUTOINCREMENT, HASHID TEXT UNIQUE, " +
        "SALT TEXT, NAME TEXT NOT NULL, LOCATION TEXT NOT NULL, METADATA TEXT " +
        "NOT NULL, ATYPE TEXT CHECK (ATYPE IN ('TANGIBLE','VIRTUAL', " +
        "'DIGITAL','INTANGIBLE','LOYALTY')), ASSETTAG TEXT, QUANTITY REAL NOT NULL, " +
        "ASSET_VALUE REAL NOT NULL, STDATE DATETIME DEFAULT CURRENT_TIMESTAMP, " +
        "EXPDATE DATETIME, BOMPORTFOLIO TEXT ); ";
    db.run(sqlddl);
    sqlddl = "CREATE TABLE IF NOT EXISTS AGREEMENT(ID INTEGER PRIMARY " +
        "KEY AUTOINCREMENT, HASHID TEXT UNIQUE, SALT TEXT, NAME TEXT " +
        "NOT NULL, SLA TEXT, WARRANTY TEXT, ATYPE TEXT CHECK (ATYPE IN ('BINDING', " +
        "'NONBINDING','TRACEABLE','POLICY')), AGREED_VALUE REAL " +
        "NOT NULL, PERCEIVED_VALUE REAL, SETTLEMENT TEXT CHECK (SETTLEMENT IN " +
        "('CASH', 'CREDIT', 'POINTS', 'FOREIGN CURR', 'BARTER', 'EXCHANGE')), " +
        "STDATE DATETIME DEFAULT CURRENT_TIMESTAMP, EXPDATE " +
        "DATETIME DEFAULT CURRENT_TIMESTAMP); ";
    db.run(sqlddl);
    sqlddl = "CREATE TABLE IF NOT EXISTS LEDGER(ID INTEGER PRIMARY " +
        "KEY AUTOINCREMENT, HASHID TEXT UNIQUE, PREVHASHID TEXT, SALT TEXT, GIVER TEXT, " +
        "TAKER TEXT, ASSET TEXT, AGREEMENT TEXT, TRAN_AMT REAL, TRAN_QNTY " +
        "REAL, SETTLEMENT TEXT CHECK (SETTLEMENT IN " +
        "('CASH', 'CREDIT', 'POINTS', 'FOREIGN CURR', 'BARTER', 'EXCHANGE')), " +
        "JOURNAL_TYPE TEXT CHECK (JOURNAL_TYPE IN ('JOURNAL', " +
        "'VOUCHER', 'IOU', 'REDEMPTION', 'LEASE')), TRAN_TYPE TEXT CHECK " +
        "(TRAN_TYPE IN ('REWARD', 'AQUISITION', 'LEND', 'BORROW', 'WIN', " +
        "'MERGE', 'VIEW', 'VOTE')), LD_DATE DATETIME DEFAULT CURRENT_TIMESTAMP); ";
    db.run(sqlddl);

    // First Party
    var ml = { "name": "John Mcguire", "bday": "1976-03-02", "ptype": "TAKER" };
    var partyInput = [], j = 0;
    var columnPassword = "helloworld";
    ml.pw = ml.name.replace(/\s+/g, '') + ml.bday + columnPassword;
    let hsns = hs.hashNSalt(ml.pw);
    ml.pwHash = hsns.passwordHash;
    ml.pwSalt = hsns.salt;
    partyInput.push(ml);

    db.run("Insert into party (name, hashid, salt, stdate, ptype) values " +
        "(?,?,?,?,?)", partyInput[j].name, partyInput[j].pwHash, partyInput[j].salt,
        partyInput[j].bday, partyInput[j].ptype);

    // 2nd party
    ml = { "name": "Jane Doe", "bday": "1962-11-28", "ptype": "TAKER" };
    ++j;
    ml.pw = ml.name.replace(/\s+/g, '') + ml.bday + columnPassword;
    hsns = hs.hashNSalt(ml.pw);
    ml.pwHash = hsns.passwordHash;
    ml.pwSalt = hsns.salt;
    partyInput.push(ml);
    
    db.run("Insert into party (name, hashid, salt, stdate, ptype) values " +
        "(?,?,?,?,?)", partyInput[j].name, partyInput[j].pwHash, partyInput[j].salt,
        partyInput[j].bday, partyInput[j].ptype);

    // 3rd party
    ml = { "name": "James Bond", "bday": "1949-9-14", "ptype": "WITNESS" };
    ++j;
    ml.pw = ml.name.replace(/\s+/g, '') + ml.bday + columnPassword;
    hsns = hs.hashNSalt(ml.pw);
    ml.pwHash = hsns.passwordHash;
    ml.pwSalt = hsns.salt;
    partyInput.push(ml);
    
    db.run("Insert into party (name, hashid, salt, stdate, ptype) values " +
        "(?,?,?,?,?)", partyInput[j].name, partyInput[j].pwHash, partyInput[j].salt,
        partyInput[j].bday, partyInput[j].ptype);

    // Asset # 1
    let mpl = {"name":"House # 1234","location":"Sparta, New Jersey","metadata":"","qty":"1","value":"100000","atype":"TANGIBLE"};
    let assetInput = [];
    j = 0; // reinitialize j
    mpl.pwd = mpl.name.replace(/\s+/g,'') + columnPassword;
    hsns = hs.hashNSalt(mpl.pwd);
    mpl.pwdHash = hsns.passwordHash;
    mpl.pwdSalt = hsns.salt;
    assetInput.push(mpl);
    db.run("INSERT INTO ASSET('HASHID','SALT','NAME','LOCATION','METADATA','ATYPE','QUANTITY','ASSET_VALUE','ASSETTAG')"+
        " VALUES (?,?,?,?,?,?,?,?,?)", assetInput[j].pwdHash, assetInput[j].pwdSalt, assetInput[j].name, assetInput[j].location, 
        assetInput[j].metadata, assetInput[j].atype, assetInput[j].qty, assetInput[j].value, assetInput[j].tag); 
    
    // Agree # 1
    let mal = {"name":"Agreement # 1234","sla":"Immediate Possession","warranty":"Limited","agreed_value":"82000","atype":"BINDING","pvalue":"200000","settle":"CASH"};
    let agInput = [];
    j = 0;
    mal.pwd = mal.name.replace(/\s+/g,'') + columnPassword;
    hsns = hs.hashNSalt(mal.pwd);
    mal.pwdHash = hsns.passwordHash;
    mal.pwdSalt = hsns.salt;
    agInput.push(mal);

    db.run("INSERT INTO AGREEMENT('HASHID','SALT','NAME','SLA','ATYPE','WARRANTY','AGREED_VALUE','PERCEIVED_VALUE','SETTLEMENT')"+
        " VALUES (?,?,?,?,?,?,?,?,?)", agInput[j].pwdHash, agInput[j].pwdSalt, agInput[j].name, agInput[j].sla, 
        agInput[j].atype, agInput[j].warranty, agInput[j].agreed_value,assetInput[j].pvalue, assetInput[j].settle);

    var IMAX = 10;
    var sqls = "INSERT INTO LEDGER (hashid, prevhashid, salt, giver, taker, asset, agreement, tran_qnty, tran_amt, journal_type, tran_type, settlement)" +
    " VALUES (?,?,?,?,?,?,?,?,?,?,?,?) ";

    let prevhash = "";
    let harray = [];
    for (var i=0; i<IMAX; i++) {
        hsns = hs.hashNSalt(columnPassword);
        let pw = hsns.passwordHash;
        let salt = hsns.salt;
        let n = Math.round(Math.random() * 2);
        let giver = partyInput[n].pwHash;
        n = Math.round(Math.random() * 2);
        let taker = partyInput[n].pwHash;
        let asset = assetInput[0].pwdHash;
        let agree = agInput[0].pwdHash;
        let qty = 1;
        let value = (Math.random() * 100000).toFixed(2);
        /*
        var nsqls = 'select "hashid" from ledger where rowid() = last_insert_rowid()';
        db.run(nsqls, (err, hash) => {
            prevhash = hash;
            console.log('prevhash', prevhash);
        })
        */ 
        harray[i] = {"pw":pw, "ph":prevhash};
        prevhash = pw;
        db.each(sqls, harray[i].pw, harray[i].ph, salt, giver, taker, asset, agree, qty, value, "JOURNAL", "AQUISITION", "CASH", (err, row) => {
            if (err) console.log(err);
        });
    }
            
    var n1 = d.getTime();
})

db.close();
