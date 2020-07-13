'use strict;'

var sqlite3 = require('./sqlite3').verbose();
var db = new sqlite3.Database('./x.db');

getData = function (callback) {
    var res = [];
    db.serialize(function () {
        db.each("PRAGMA table_info(party);", function (err, row) {
            // console.log(row.id + ": " + row.info);
            // console.log(row, typeof(row));
            res.push(row);
        }, function () { // calling function when all rows have been pulled
            db.close(); //closing connection
            callback(res);
        });
    });
}

getData(function(data) {
    console.log(data);
});