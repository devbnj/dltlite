'use strict';
let crypto = require('crypto');

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} strLength - Length of the random string.
 */
let randomString = function(strLength){
    return crypto.randomBytes(Math.ceil(strLength/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,strLength);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
let sha512 = function(password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

exports.hashNSalt = (userpassword) => {
    var salt = randomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    // console.log('UserPassword = '+userpassword);
    // console.log('Passwordhash = '+passwordData.passwordHash);
    // console.log('nSalt = '+passwordData.salt);
    return passwordData;
}
