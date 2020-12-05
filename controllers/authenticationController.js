var express = require('express');
const repository = require('../services/repository');
const helpers = require('../helpers')

// Login User
module.exports.login = async function (req, res) {
    await repository.validateUser(req.body)
        .then(x => {
            // Add response
            console.log(req.body.passwor)
            console.log(x.password)

            if(req.body.password != x.password){
                res.status(401).send()
            }

            var jwt = helpers.generatejwt(req.username)
            var response = {id: x._id, username: x.userName, token: jwt}
            res.status(200).send(response);
        })
        .catch(x => {
            console.log(x);
            return res.status(404).send();
        })   

}

module.exports.register = async function (req,res) {
    await repository.createUser(req.body)
        .then(x => {
            console.log('YEAH!')
            return res.status(200).send();
        })
        .catch(x => {
            console.log(x);
            return res.status(404).send();
        })
}

