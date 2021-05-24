const express = require('express');
const app = express();
const fs = require('fs');

const mongoose = require('mongoose');
const Msg = require('./models/message');
const mongoDB = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.8ama8.mongodb.net/my-message-database?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => console.log(err));

const port = process.env.PORT || 80
const server = app.listen(port, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", server.address().port);
});

const io = require('socket.io')(server);

app.use('/scripts', express.static(__dirname + '/scripts/'));
const indexA = fs.readFileSync(__dirname + "/templates/index_part1.html", "utf-8");
const indexB = fs.readFileSync(__dirname + "/templates/index_part2.html", "utf-8");


app.get('/', (req, res) => {
    Msg.find({}, (err, messages) => {
        console.log(messages)
        if (messages.length === 0)
            res.sendFile(__dirname + '/index.html');
        else {
            let template = '';
            messages.forEach(msg => template += "<div class='alert alert-" + msg.style + "'><b>" + msg.name + "</b>: " + msg.message + "</div>");
            res.send(indexA + template + indexB);
        }
    }).catch(err => console.log(err));
});

// Connections array
connections = [];

// New user/tab connection
io.sockets.on('connection', socket => {
    console.log("Succesful connection");
    // New connection added to array
    connections.push(socket);

    // Disconnect function
    socket.on('disconnect', data => {
        // Removal of user/connection from array
        connections.splice(connections.indexOf(socket), 1);
        console.log("Disconnected");
    });

    // Function that handles the sending of a message
    socket.on('sendMessage', data => {

        let msg = new Msg({ name: data.name, message: data.mess, style: data.className });
        msg.save().then(() => {
            // Function that adds the new message to be visible for all connections
            io.sockets.emit('addMessage', { name: msg.name, mess: msg.message, className: msg.style });
        });
    });
});






