var pld = msg.payload;
var hs = global.get('hashnsalt');
var dblite3 = global.get('dblite3').verbose();
let foo = env.get("USER");
var lgrname = "/home/" + foo + "/sqlite/sqlite-sync/data/lgr.db";
var db = new dblite3.Database(lgrname);

var columnPassword = "helloworld";
let hsns = hs.hashNSalt(columnPassword);

var putData = function (callback) {
    db.serialize(function () {
        // First Party
        var ml = { "name": "John Mcguire", "bday": "1976-03-02", "ptype": "TAKER" };
        var partyInput = [], j = 0;
        ml.pw = ml.name.replace(/\s+/g, '') + ml.bday + columnPassword;
        hsns = hs.hashNSalt(ml.pw);
        ml.pwHash = hsns.passwordHash;
        ml.pwSalt = hsns.salt;
        partyInput.push(ml);

        db.run("Insert into party (name, hashid, salt, stdate, ptype) values " +
            "(?,?,?,?,?)", partyInput[j].name, partyInput[j].pwHash, partyInput[j].salt,
            partyInput[j].bday, partyInput[j].ptype);

        // 2nd party
        ml = { "name": "Jane Doe", "bday": "1962-11-28", "ptype": "TAKER" };
        ++j;
        ml.pw = ml.name.replace(/\s+/g, '') + ml.bday + columnPassword;
        hsns = hs.hashNSalt(ml.pw);
        ml.pwHash = hsns.passwordHash;
        ml.pwSalt = hsns.salt;
        partyInput.push(ml);

        db.run("Insert into party (name, hashid, salt, stdate, ptype) values " +
            "(?,?,?,?,?)", partyInput[j].name, partyInput[j].pwHash, partyInput[j].salt,
            partyInput[j].bday, partyInput[j].ptype);

        // 3rd party
        ml = { "name": "James Bond", "bday": "1949-9-14", "ptype": "WITNESS" };
        ++j;
        ml.pw = ml.name.replace(/\s+/g, '') + ml.bday + columnPassword;
        hsns = hs.hashNSalt(ml.pw);
        ml.pwHash = hsns.passwordHash;
        ml.pwSalt = hsns.salt;
        partyInput.push(ml);

        db.run("Insert into party (name, hashid, salt, stdate, ptype) values " +
            "(?,?,?,?,?)", partyInput[j].name, partyInput[j].pwHash, partyInput[j].salt,
            partyInput[j].bday, partyInput[j].ptype);

        // Asset # 1
        let mpl = { "name": "House # 1234", "location": "Sparta, New Jersey", "metadata": "", "qty": "1", "value": "100000", "atype": "TANGIBLE" };
        let assetInput = [];
        j = 0; // reinitialize j
        mpl.pwd = mpl.name.replace(/\s+/g, '') + columnPassword;
        hsns = hs.hashNSalt(mpl.pwd);
        mpl.pwdHash = hsns.passwordHash;
        mpl.pwdSalt = hsns.salt;
        assetInput.push(mpl);
        db.run("INSERT INTO ASSET('HASHID','SALT','NAME','LOCATION','METADATA','ATYPE','QUANTITY','ASSET_VALUE','ASSETTAG')" +
            " VALUES (?,?,?,?,?,?,?,?,?)", assetInput[j].pwdHash, assetInput[j].pwdSalt, assetInput[j].name, assetInput[j].location,
            assetInput[j].metadata, assetInput[j].atype, assetInput[j].qty, assetInput[j].value, assetInput[j].tag);

        // Agree # 1
        let mal = { "name": "Agreement # 1234", "sla": "Immediate Possession", "warranty": "Limited", "agreed_value": "82000", "atype": "BINDING", "pvalue": "200000", "settle": "CASH" };
        let agInput = [];
        j = 0;
        mal.pwd = mal.name.replace(/\s+/g, '') + columnPassword;
        hsns = hs.hashNSalt(mal.pwd);
        mal.pwdHash = hsns.passwordHash;
        mal.pwdSalt = hsns.salt;
        agInput.push(mal);

        db.run("INSERT INTO AGREEMENT('HASHID','SALT','NAME','SLA','ATYPE','WARRANTY','AGREED_VALUE','PERCEIVED_VALUE','SETTLEMENT')" +
            " VALUES (?,?,?,?,?,?,?,?,?)", agInput[j].pwdHash, agInput[j].pwdSalt, agInput[j].name, agInput[j].sla,
            agInput[j].atype, agInput[j].warranty, agInput[j].agreed_value, assetInput[j].pvalue, assetInput[j].settle);

        var IMAX = 5;
        var sqls = "INSERT INTO LEDGER (hashid, prevhashid, salt, giver, taker, asset, agreement, tran_qnty, tran_amt, journal_type, tran_type, settlement)" +
            " VALUES (?,?,?,?,?,?,?,?,?,?,?,?) ";

        let prevhash = "";
        let harray = [];
        for (var i = 0; i < IMAX; i++) {
            hsns = hs.hashNSalt(columnPassword);
            let pw = hsns.passwordHash;
            let salt = hsns.salt;
            let n = Math.round(Math.random() * 2);
            let giver = partyInput[n].pwHash;
            n = Math.round(Math.random() * 2);
            let taker = partyInput[n].pwHash;
            let asset = assetInput[0].pwdHash;
            let agree = agInput[0].pwdHash;
            let qty = 1;
            let value = (Math.random() * 100000).toFixed(2);
            harray[i] = { "pw": pw, "ph": prevhash };
            prevhash = pw;
            db.each(sqls, harray[i].pw, harray[i].ph, salt, giver, taker, asset, agree, qty, value, "JOURNAL", "AQUISITION", "CASH");
        }

    });
}

putData(function (data) {
    db.close();
    node.send(msg);
    node.done();
});

// return;