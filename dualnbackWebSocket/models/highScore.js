var mongoose = require('mongoose');

const HighScoreSchema = new mongoose.Schema(
    {
        rank: Number,
        name: String,
        score: Number
    }
);

module.exports = mongoose.model('HighScore', HighScoreSchema);