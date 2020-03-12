var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
users = [];
connections = [];

server.listen(process.env.PORT || 3000);

app.use(express.static(__dirname + "/public"));
app.get("/", function (req, res) {
    res.sendFile(__dirname + "public/index.html");
});

io.sockets.on("connection", function (socket) {
    connections.push(socket);
    socket.on("disconnect", function () {
        connections.splice(connections.indexOf(socket), 1);
        users.splice(users.indexOf(socket.username), 1);
        getUsersOnline();
    });
    socket.on("new message", function (data) {
        io.sockets.emit("received message", { msg: data, username: socket.username })
    });
    socket.on("new user", function (data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        getUsersOnline();
    });
    
    function getUsersOnline() {
        io.sockets.emit("get users", users);
    }
})