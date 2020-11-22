const mongoose = require("mongoose");
const UserModel = require("../models/user");

// This is best practice i suppose?
exports.createUser = function(user){
    return new Promise(function(resolve, reject) {
        UserModel.create(user, (err, res) => err ? reject(err) : resolve(res))
    });
}
    
exports.validateUser = function(user){
    return new Promise(function(resolve, reject){
        UserModel.findOne({'userName': user.userName}, (err, res) => err ? reject(err) : resolve(res))
    })
}