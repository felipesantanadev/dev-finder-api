const Developer = require('../models/Dev');
const Parsers = require('../utils/Parsers');

module.exports = {
    async index(req, res) {
        try{
            // Search devs in 10km radius
            // Filter by technologies

            const { latitude, longitude, techs} = req.query;
            const techsArray = Parsers.stringToArray(techs, ',');

            const devs = await Developer.find({
                techs: {
                    $in: techsArray,
                },
                location: {
                    $near: { // MongoDB uses near to find something near
                        $geometry: { // MongoDB can use geometry to find something near the relative coordinate
                            type: 'Point', // The geometry must be Point
                            coordinates: [longitude, latitude] // longitude must be in index 0 and latitude must be in index 1
                        },
                        $maxDistance: 10000, // Set the distance in meters
                    },
                },
            });

            return res.json(devs);
        } catch(err){
            return res.status(501).json(err);
        }
    },
}