var sqlite3 = require('./sqlite3').verbose();
var db = new sqlite3.Database('./x.db');

db.serialize(function() {
  db.each("DELETE FROM lorem where info = 'Ipsum 3'", function(err, row) {
      console.log(row.id + ": " + row.info);
  });
});

db.close();