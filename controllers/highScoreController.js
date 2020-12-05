const express = require('express');

module.exports.getAllHighScores = async (request, result) => {
    await repo.getAllWorkoutPrograms()
    .then(workoutPrograms => {
        res
        .status(200)
        .send(workoutPrograms);
    })
    .catch(err =>{
        res
        .status(400)
        .json(err);
    });
}

module.exports.addHighScore = async (request, result) => {

}