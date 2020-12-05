const mongoose = require("mongoose");
const HighScore = require("../models/highScore");

exports.createHighScore = function(highScore){
    return new Promise(function(resolve, reject) {
        HighScore.create(highScore, (err, res) => err ? reject(err) : resolve(res))
    });
}

exports.getAllHighScores = function(){
    return new Promise((resolve, reject) => 
        HighScore.find({},
            (err, res) => err ? reject(err) : resolve(res))
    )
}