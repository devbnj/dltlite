// Nodejs encryption with CTR
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

exports.dlencrypt = (text) => {
 let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
 let encrypted = cipher.update(text);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return { iv: iv.toString('hex'), ky: key.toString('hex'), 
    dt: encrypted.toString('hex') };
}

exports.dldecrypt = (text) => {
 let iv = Buffer.from(text.iv, 'hex');
 let encryptedText = Buffer.from(text.dt, 'hex');
 let ky = Buffer.from(text.ky, 'hex');
 let decipher = crypto.createDecipheriv('aes-256-cbc', ky, iv);
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted.toString();
}

/*
var hw = encrypt("Some serious stuff")
console.log(hw)
console.log(decrypt(hw))
*/