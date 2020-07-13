var sqlite3 = require('./sqlite3').verbose();
var db = new sqlite3.Database('./x.db');

db.serialize(function() {
  db.each("DROP TABLE lorem;", function(err, row) {
      console.log(row.id + ": " + row.info);
  });
});

db.close();