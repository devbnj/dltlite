let sqliteSync = require('../lib/sqlite-sync');

sqliteSync.connect('test/test.db');
// sqlite.debug = true;

let result = sqliteSync.run("CREATE TABLE COMPANYS(ID  INTEGER PRIMARY KEY AUTOINCREMENT, NAME TEXT NOT NULL);");

sqliteSync.insert("COMPANYS", { NAME: "TESTE" }, (result) => { });

sqliteSync.run("BEGIN; DELETE FROM COMPANYS WHERE ID = 6; ROLLBACK;");

sqliteSync.run('SELECT * FROM COMPANYS', (result) => {
	if (result.error) throw (result.error);
	console.log('Results from test1', result);
});

// poormans testing
let testVal1 = "It ain't there";
let testVal2 = "It's there";
sqliteSync.insert("COMPANYS", { NAME: testVal1 });

let test = false;
sqliteSync.run("SELECT * FROM COMPANYS WHERE NAME = ?", [testVal1], 
	(result) => {
	test = true ? (result.length > 0) : false;
});
if (!test) console.log('Test1 failed:', testVal1);

let updated = sqliteSync.update('COMPANYS', 
	{ NAME: testVal2 }, 
	{ NAME: testVal1 });
if (updated != 0) {
	console.log('Test2 failed:', updated + ' updated rows != 1');
}
	
let deleted = sqliteSync.delete("COMPANYS", { NAME: testVal2 });
if (deleted != 0) {
	console.log('Test3 failed:', deleted + ' deleted rows != 1');
}
	
test = false;
sqliteSync.run("SELECT * FROM COMPANYS WHERE SUBSTR(NAME,0,2) = 'It'", 
	(result) => {
	test = true ? (result.length == 0) : false;		
});
if (!test) console.log('Test4 failed:', testVal2);

sqliteSync.close();