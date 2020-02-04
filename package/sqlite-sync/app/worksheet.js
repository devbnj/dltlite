var ml = msg.payload;
var hs = global.get('hashnsalt');
var partyInput = {};
var columnPassword = "helloworld";
partyInput.name = ml.name;
partyInput.bday = ml.stdate;
var ptype = 'GIVER';
if (ml.taker) ptype = 'TAKER'; 
else if (ml.attorney) ptype = 'ATTORNEY';
else if (ml.thirdparty) ptype = 'THIRDPARTY';
else if (ml.referee) ptype = 'REFEREE'
partyInput.ptype = ptype;
partyInput.pw = partyInput.name.replace(/\s+/g,'') + 
    partyInput.bday + columnPassword;
let hsns = hs.hashNSalt(partyInput.pw);
var sql = "INSERT INTO PARTY ('ID','HASHID','SALT','NAME','PTYPE') VALUES (null, '"+hsns.passwordHash+"', '"+hsns.salt+"', '"+partyInput.name+"', '"+partyInput.ptype+"');";
msg.topic = sql;
return msg;

// ===============================================================

let mpl = msg.payload;
let hs = global.get('hashnsalt');
let assetInput = {};
assetInput.name = mpl.name;
assetInput.location = mpl.location;
var atype = 'TANGIBLE';
if (mpl.virtual) atype = 'VIRTUAL';
if (mpl.digital) atype = 'DIGITAL';
if (mpl.intangible) atype = 'INTANGIBLE';
assetInput.atype = atype;
assetInput.qty = mpl.qty;
assetInput.value = mpl.value;
assetInput.metadata = mpl.metadata;
assetInput.tag = mpl.tag;
var columnPassword = "helloworld";
assetInput.pwd = assetInput.name.replace(/\s+/g,'') + columnPassword;
let hsns = hs.hashNSalt(assetInput.pwd);
var sql = "INSERT INTO ASSET ("+
    "'ID','HASHID','SALT','NAME','LOCATION','METADATA',"+
    "'ATYPE','QUANTITY','ASSET_VALUE', 'ASSETTAG') "+
    "VALUES (null, '"+hsns.passwordHash+"', '"+
    hsns.salt+"', '"+
    assetInput.name+"', '"+
    assetInput.location+"', '"+
    assetInput.metadata+"', '"+
    assetInput.atype+"', "+
    assetInput.qty+", "+
    assetInput.value+", '"+
    assetInput.tag+
    "');";
msg.topic = sql;
return msg;


// ===============================================================

let mpl = msg.payload;
let hs = global.get('hashnsalt');
let agInput = {};
agInput.name = mpl.name;
agInput.sla = mpl.sla;
var atype = 'BINDING';
if (mpl.nonbinding) atype = 'NONBINDING';
if (mpl.traceable) atype = 'TRACEABLE';
if (mpl.policy) atype = 'POLICY';
agInput.atype = atype;
agInput.warranty = mpl.warranty;
agInput.value = mpl.value;
var columnPassword = "helloworld";
agInput.pwd = agInput.name.replace(/\s+/g,'') + columnPassword;
let hsns = hs.hashNSalt(agInput.pwd);
var sql = "INSERT INTO AGREEMENT ("+
    "'ID','HASHID','SALT','NAME','SLA',"+
    "'ATYPE','WARRANTY','AGREED_VALUE') "+
    "VALUES (null, '"+hsns.passwordHash+"', '"+
    hsns.salt+"', '"+
    agInput.name+"', '"+
    agInput.sla+"', '"+
    agInput.atype+"', '"+
    agInput.warranty+"', "+
    agInput.value+
    "');";
msg.topic = sql;
return msg;
    
// ==========================================================

var dt = msg.payload;
var options = [];
var row;
for (var i =0; i < dt.length; i++) {
    row = dt[i];
    var optsData = "{\""+row.NAME+"\": \""+row.HASHID+"\"}";
    console.log('optsData', optsData);
    var obj = JSON.parse(optsData);
    options.push(obj);
}
msg.options = options;
return msg;
    