// Nodejs encryption with CTR
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

exports.dlencrypt = (text) => {
    let result = [];
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    result[0] = (iv.toString('hex'));
    result[1] = (key.toString('hex'));
    result[2] = (encrypted.toString('hex'));
    return result;
}

exports.dldecrypt = (eObj) => {
    let iv = Buffer.from(eObj[0], 'hex');
    let encryptedText = Buffer.from(eObj[2], 'hex');
    let ky = Buffer.from(eObj[1], 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', ky, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

