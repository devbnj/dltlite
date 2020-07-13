'use strict';

var sqlite3 = require('./sqlite3').verbose();
var db = new sqlite3.Database('/home/devbnjhp/sqlite/node-sqlite3/x.db');

var getData = function (callback) {
    db.serialize(function () {
        var budget = 0;
        var actual = 0;
        var agreed = 0;
        db.all("SELECT sum(asset_value) as v FROM asset", function (err, row1) {
            budget = row1[0].v;
            console.log(row1);
        });
        db.all("SELECT sum(agreed_value) as v2 FROM agreement", function (err, row3) {
            agreed = row3[0].v2;
            console.log(row3);
        });
        db.all("SELECT sum(tran_amt) as v1 FROM ledger", function (err, row2) {
            actual = row2[0].v1;
            console.log(row2);
            callback({'budget': budget, 'actual': actual, 'agreed': agreed})
        });
    });
}

getData(function(data) {
    db.close();
    console.log(data);
    var percent1 = (Number(data.actual) / Number(data.budget) *10);
    var percent2 = (Number(data.actual) / Number(data.agreed) *10);
    console.log('act percent', percent1, percent2);
});