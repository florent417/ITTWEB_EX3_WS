const mongoose = require("mongoose");
const HighScore = require("../models/highScore");

exports.createHighScore = async function(highScore){
    const tempHighScore = new HighScore();
    tempHighScore.score = highScore.score;
    tempHighScore.name = highScore.name;
    return new Promise(async function(resolve, reject) {
        HighScore.findOne().limit(1).exec(async (err, data) => {
            if(!data){
                HighScore.create(tempHighScore, (err, res) => err ? reject(err) : resolve(res))
            }
            else if(err) reject(err)
            else if(data.score < tempHighScore.score){
                console.log(data.score);
                const temp = new HighScore();
                temp.score = data.score;
                temp.name = data.name;
                await HighScore.deleteOne({name: data.name})
                await HighScore.create(tempHighScore, (err, res) => err ? reject(err) : resolve(res))
            }
        })
    })
}

exports.getHighScore = function(){
    return new Promise((resolve, reject) => {
        HighScore.findOne().limit(1).exec(async (err, data) => {
            err ? reject(err) : resolve(data)
        }
    )})
}

exports.getAllHighScores = function(){
    return new Promise((resolve, reject) => 
        HighScore.find({},
            (err, res) => err ? reject(err) : resolve(res))
    )
}