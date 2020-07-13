'use strict';
let pem = require('../lib/pem');

exports.getCert = () => {
    pem.createCertificate({ days: 365, selfSigned: true }, 
        function (err, keys) {
        if (err) {throw err; }
        else {
            return keys.certificate;
        }
    });
}
