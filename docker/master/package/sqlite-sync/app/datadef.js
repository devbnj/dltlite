/**
 * datadef.js
 * 
 */
/*jshint esversion: 6 */
/*jshint node: true*/

'use strict';

let dataPassword = 'saratoga';
let columnPassword = 'cloudcoverage';
let partyInput = {};
let assetInput = {};


let sqliteEnc = require('../lib/sqlite-enc'); 
sqliteEnc.connect('data/ledger_db.enc','saratoga', 'aes-256-ctr');

/*
let sqliteEnc = require('../lib/sqlite-append-sync');
sqliteEnc.connect('data/dlt.db');
*/

let hs = require('./hashnsalt');
// let pem = require('../lib/pem');

sqliteEnc.debug = true;

try {
    let result; 
    let stmt = "CREATE TABLE IF NOT EXISTS " +
    "PARTY(ID INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "HASHID TEXT UNIQUE, " +
    "SALT TEXT, " +
    "NAME TEXT NOT NULL, " +
    "PTYPE TEXT CHECK (PTYPE IN ('GIVER','TAKER','WITNESS','ATTORNEY','THIRDPARTY','REFEREE')), " +
    "STDATE DATETIME DEFAULT CURRENT_TIMESTAMP, " +
    "ENDDATE DATETIME " +
    ");";
    // console.log('STMT', stmt);
    result = sqliteEnc.exec(stmt);
    
    stmt = "CREATE TABLE IF NOT EXISTS " +
    "ASSET(ID INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "HASHID TEXT UNIQUE, " +
    "SALT TEXT, " +
    "NAME TEXT NOT NULL, " +
    "LOCATION TEXT NOT NULL, " +
    "METADATA TEXT NOT NULL, " +
    "ATYPE TEXT CHECK (ATYPE IN ('TANGIBLE','VIRTUAL','DIGITAL','INTANGIBLE')), " +
    "ASSETTAG TEXT," + 
    "QUANTITY REAL NOT NULL, " +
    "VALUE REAL NOT NULL, " +
    "STDATE DATETIME DEFAULT CURRENT_TIMESTAMP, " +
    "EXPDATE DATETIME, " +
    "BOMPORTFOLIO TEXT " +
    ");";
    // console.log('STMT', stmt);
    result = sqliteEnc.exec(stmt);

    stmt = "CREATE TABLE IF NOT EXISTS " +
    "AGREEMENT(ID INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "HASHID TEXT UNIQUE, " +
    "SALT TEXT, " +
    "NAME TEXT NOT NULL, " +
    "SLA TEXT, " +
    "WARRANTY TEXT, " +
    "ATYPE TEXT CHECK (ATYPE IN ('BINDING','NONBINDING','TRACEABLE','POLICY')), " +
    "VALUE REAL NOT NULL, " +
    "STDATE DATETIME DEFAULT CURRENT_TIMESTAMP, " +
    "EXPDATE DATETIME DEFAULT CURRENT_TIMESTAMP " +
    ");";
    // console.log('STMT', stmt);
    result = sqliteEnc.exec(stmt);

} catch (e) {
    // if table exists, just ignore
}

/**
 * Do inserts for Party
 */

partyInput.name = "Joe Smith";
partyInput.bday = "1112";
partyInput.pw = partyInput.name.replace(/\s+/g,'') + partyInput.bday + columnPassword;
let hsns = hs.hashNSalt(partyInput.pw);
sqliteEnc.insert("PARTY", { NAME: partyInput.name, 
    HASHID: hsns.passwordHash, 
    SALT: hsns.salt,
    PTYPE: "GIVER"
    }, 
    (result) => { }
);

partyInput.name = "Nicole Kidman";
partyInput.bday = "76";
partyInput.pw = partyInput.name.replace(/\s+/g,'') + partyInput.bday + columnPassword;
hsns = hs.hashNSalt(partyInput.pw);
sqliteEnc.insert("PARTY", { NAME: partyInput.name, 
    HASHID: hsns.passwordHash, 
    SALT: hsns.salt,
    PTYPE: "TAKER"
    }, 
    (result) => { }
);

/**
 * Do inserts for Asset
 */

assetInput.name = 'Real estate on main street';
assetInput.location = '321 main street, sparta, nj 07871';
assetInput.pwd = assetInput.name.replace(/\s+/g,'') + columnPassword;
hsns = hs.hashNSalt(assetInput.pwd);
sqliteEnc.insert("ASSET", { NAME: assetInput.name, 
    HASHID: hsns.passwordHash, 
    SALT: hsns.salt,
    LOCATION: assetInput.location,
    METADATA: '',
    ATYPE: "TANGIBLE",
    QUANTITY: 1,
    VALUE: 300000.00
    }, 
    (result) => { }
);

/**
 * Query now on Party
 */
sqliteEnc.exec('SELECT HASHID FROM PARTY WHERE NAME=?', [partyInput.name], 
(result) => {
    if (result.error) throw (result.error);
    if (result.HASHID == hs.hashNSalt(partyInput.pw)) {
        // the HASHED stuff is ok
    }
	console.log('Results from select hashid', result);
});

console.log('Will attempt to delete and update party');
sqliteEnc.exec("BEGIN; DELETE FROM PARTY WHERE ID = 10; ROLLBACK;");
console.log('Check if deleted');
sqliteEnc.exec('SELECT * FROM PARTY', (result) => {
    if (result.error) throw (result.error);
    console.log('After deletion results', result);
});

/*
// poor developer's test
let testVal1 = "It ain't there";
let testVal2 = "It's there";
sqliteEnc.insert("COMPANYS", { NAME: testVal2 });

let test = false;
sqliteEnc.exec("SELECT * FROM COMPANYS WHERE NAME = ?", [testVal2], 
	(result) => {
    test = true ? (result.length > 0) : false;
    console.log('Test1 results:', result); 
});
if (!test) console.log('Test1 failed:', testVal1); 

let updated = sqliteEnc.update('COMPANYS', 
	{ NAME: testVal2 }, 
	{ NAME: testVal1 });
if (updated != 0) {
	console.log('Test2 update failed:', updated + ' updated rows != 1');
} else console.log('Test2 update results:', updated);
	
let deleted = sqliteEnc.delete("COMPANYS", { NAME: testVal2 });
if (deleted != 0) {
	console.log('Test3 delete failed:', deleted + ' deleted rows != 1');
} else console.log('Test3 delete results:', deleted);
	
test = false;
sqliteEnc.exec("SELECT * FROM COMPANYS WHERE SUBSTR(NAME,0,2) = 'It'", 
	(result) => {
    test = true ? (result.length == 0) : false;
    console.log('Test4 results:', result);
});
if (!test) console.log('Test4 failed:', testVal2);

console.info('All tests complete. Final results. Bye.');
sqliteEnc.exec('SELECT * FROM COMPANYS', (result) => {
	if (result.error) throw (result.error);
	console.log('Results from test-append-sync', result);
});
*/
sqliteEnc.close();
