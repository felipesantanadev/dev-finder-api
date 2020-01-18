const axios = require('axios');
const Developer = require('../models/Dev');
const Parsers = require('../utils/Parsers');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
    async index(req, res) {
        try {
            const devs = await Developer.find();
            return res.json(devs);
        
        } catch(err){
            res.status(501).json({
                error: err
            });
        }
    },

    async create(req, res) {
        try{
            const { github_username, techs, latitude, longitude } = req.body;

            const dev = await Developer.findOne({ github_username });
            if(dev){
                return res.status(401).json({message: 'User already created.'});
            }

            const techsArray = Parsers.stringToArray(techs, ',');
    
            const response = await axios.get(`https://api.github.com/users/${github_username}`);
    
            // if the name property is null on response.data, name receives the login property
            const { name = login, avatar_url, bio } = response.data;
    
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude] // Mongo receives the longitude in the index 0 and latitude in the index 1
            }
    
            const result = await Developer.create({
                github_username,
                name, 
                avatar_url,
                bio,
                techs: techsArray,
                location
            });

            // Filter connections near the new user
            const sendSocketMessageTo = findConnections({
                latitude, 
                longitude
            }, techs);

            // Notify all near users about the new user
            sendMessage(sendSocketMessageTo, 'new-dev', result);
    
            return res.json(result);
        } catch (err) {
            res.status(501).json({
                error: err
            });
        }
    },
}