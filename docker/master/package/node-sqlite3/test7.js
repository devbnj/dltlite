var xs = "{\"sql\":\"INSERT INTO LEDGER (hashid, salt, giver, taker, asset, agreement, tran_qnty, tran_amt, journal_type, tran_type)  VALUES (?,?,?,?,?,?,?,?,?,?)\",\"pw\":\"aecab414ce8eb4957f177dfb5affa75b3db5883e84f548674d95589bc3eb27cb5b4ddd3352063ce4919af82ae8a1f969b31ee372afa42d76c04aa02ff1b7c61e\",\"salt\":\"b5b2630dcc841b9c\",\"giver\":\"\",\"taker\":\"\",\"agree\":\"\",\"qty\":0,\"value\":0,\"jtype\":\"JOURNAL\",\"ttype\":\"AQUISITION\"}";
var yy = JSON.parse(xs);
console.log(yy);