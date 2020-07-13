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

db.serialize(function () {
    var sqlddl = "SELECT * FROM PARTY";
    db.all(sqlddl, (err, result) => {
        console.log(result);
    });
    sqlddl = "SELECT * FROM LEDGER";
    db.all(sqlddl, (err, result) => {
        console.log(result);
    });
    
})

db.close();
