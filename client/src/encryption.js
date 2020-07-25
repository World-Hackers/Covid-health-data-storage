crypto = require('crypto');


function genHash(p){

    pass = p.toString();

    var res = [];

    var salt = crypto.randomBytes(16).toString('hex');
    var hash = crypto.pbkdf2Sync(pass, salt, 1000, 64, `sha512`).toString(`hex`);

    res.push(hash);
    res.push(salt);

    return res;
}

function checkHash(s,p){
    var hash = crypto.pbkdf2Sync(p, s, 1000, 64, `sha512`).toString(`hex`);

    return hash.toString();
}

module.exports = {
    genHash,
    checkHash
}
