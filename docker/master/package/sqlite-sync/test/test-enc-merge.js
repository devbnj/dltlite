/* test-enc-merge.js */
let sqliteSync = require('../lib/sqlite-append-sync');
sqliteSync.connect('test/test.db');

let gresult = {};
sqliteSync.exec('SELECT * FROM COMPANYS', (result) => {
    if (result.error) throw (result.error)
    else console.info('Sync dbase', result);
    gresult = result;
});

sqliteSync.close();

let sqliteEnc = require('../sqlite-enc');
//Connecting - (databaseFile, [password], [algorithm])
sqliteEnc.connect('test/test-db.enc', 'myPass', 'aes-256-ctr');

//Creating Table - you can run any command
sqliteEnc.exec("CREATE TABLE COMPANYS (ID INTEGER PRIMARY KEY AUTOINCREMENT, NAME TEXT NOT NULL);");

sqliteEnc.insert("COMPANYS", gresult, (insertId) => {
    // console.log("Inserted ID = ", insertId);
});

console.log('Encrypted dbase', sqliteEnc.exec("SELECT * FROM COMPANYS;"));

sqliteEnc.close();
