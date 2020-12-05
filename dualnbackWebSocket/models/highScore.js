var mongoose = require('mongoose');

const HighScoreSchema = new mongoose.Schema(
    {
        name: String,
        score: Number
    }
);

module.exports = mongoose.model('HighScore', HighScoreSchema);