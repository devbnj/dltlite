'use strict;'

var sqlite3 = require('./sqlite3').verbose();
var db = new sqlite3.Database('/home/devbnjhp/sqlite/node-sqlite3/lgr.db');

getData = function (callback) {
    var res = [];
    var party;
    var asset;
    db.serialize(function () {
        db.all("SELECT name, hashid FROM Party;", function (err, row) {
            // console.log(row.id + ": " + row.info);
            // console.log(row, typeof(row));
            party = row;
        })
        db.all("SELECT name, hashid FROM Asset;", function (err, row) {
            // console.log(row.id + ": " + row.info);
            // console.log(row, typeof(row));
            asset = row;
            res.party = party;
            res.asset = asset;
            callback(res);
        })
    });
}

getData(function(data) {
    db.close();
    console.log(data);
});