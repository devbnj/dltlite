let sqliteEnc = require('../lib/sqlite-enc'); 

sqliteEnc.connect('test/test-db.enc','myPass', 'aes-256-ctr');
sqliteEnc.debug = true;

try {
    let result = sqliteEnc.exec("CREATE TABLE COMPANYS(ID INTEGER PRIMARY KEY AUTOINCREMENT, NAME TEXT NOT NULL);");
} catch (e) {
    // if table exists, just ignore
}
sqliteEnc.insert("COMPANYS", { NAME: "Synch Test" }, (result) => { });

sqliteEnc.exec("BEGIN; DELETE FROM COMPANYS WHERE ID = 6; ROLLBACK;");

sqliteEnc.exec('SELECT * FROM COMPANYS', (result) => {
	if (result.error) throw (result.error);
	console.log('Results from test-append-sync', result);
});

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
sqliteEnc.close();
