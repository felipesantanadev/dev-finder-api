const mongoose = require('mongoose');
const PointSchema = require('../utils/PointSchema');

const DeveloperSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    github_username: String,
    bio: String,
    avatar_url: String,
    techs: [String],
    location: {
        type: PointSchema,
        index: '2dsphere' // Create a 2dsphere index to coordinate points (see mongo docs)
    }
});

module.exports = mongoose.model('Developer', DeveloperSchema);