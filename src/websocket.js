const socketio = require('socket.io');
const parser = require('./utils/Parsers');
const calculateDistance = require('./utils/Coordinates');

let io;
const connections = [];

exports.setupWebSocket = (server) => {
    io = socketio(server);

    io.on('connection', socket => {
        console.log(`Client ${socket.id} connected...`);
        const { latitude, longitude, techs } = socket.handshake.query;

        // This can be saved in a DB as the number of user increases
        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude)
            },
            techs: parser.stringToArray(techs, ',')
        });

        socket.on('disconnect', () => {
            console.log('Disconnecting...');
            const connection = connections.findIndex(connection => connection.id == socket.id);
            connections.slice(connection, 1);
        });
    });

    
    // Todo: remove connections on disconect
}

exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
        // Check each connection to verify if its owner is in a distance less than 10Km
        // comparing to the {coordinates} param
        // and has some of the technologies in the {techs} param.
        var distance = calculateDistance(coordinates, connection.coordinates);
        
        return distance <= 10 
               && connection.techs.some(tech => techs.includes(tech));
    });
}

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        console.log(`Sending message to ${connection.id}`)
        io.to(connection.id).emit(message, data);
    });
}