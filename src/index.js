const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv').config();
const router = require('./routes');
const cors = require('cors');
const http = require('http');
const { setupWebSocket } = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebSocket(server);

// Connect to Database
mongoose.connect(process.env.MONGODB_CONNECTION,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err) => {
        if(err){
            console.log(`Error to connect to database: ${err}`);
        }
    });

// Using middlewares
app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(router);

server.listen(4444, () => console.log('Application running on port 4444...'));