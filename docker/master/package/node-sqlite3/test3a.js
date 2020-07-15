'use strict;'

var sqlite3 = require('./sqlite3').verbose();
var db = new sqlite3.Database('./x.db');

async function getData() {
    var res = [];
    let promise = new Promise((resolve, reject) => {    
        db.serialize(function () {
            db.each("PRAGMA table_info(party);", function (err, row) {
                res.push(row);
            }, function() {
                resolve (res);
            })
        })
    })

    let result = await promise;
    return result;
}

getData().then (function(data) {
    console.log(data);
});