const jwt = require('jsonwebtoken');

module.exports.generatejwt = function(username){
    let expiry = new Date();
    expiry.setDate(expiry.getDate() + 90);

    return jwt.sign({
        name: username,
        exp: parseInt(expiry.getTime() / 1000)},
        process.env.SECRETKEY)
}