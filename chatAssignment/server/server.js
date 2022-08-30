const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const io = require("socket.io")(http, {
    cors: {
        orgin: "http://localhost:4200",
        methods: ["GET", "POST"],
    }
});
const sockets = require("./socket.js");
const server = require("./listen.js");

const PORT = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.use(cors());

sockets.connect(io, PORT);

server.listen(http, PORT)

app.post('/login', require("./api/auth.js"));

app.get('/getGroups', require("./api/group.js").getGroups);
app.post('/getGroupsByUserID', require("./api/group.js").getGroupDetailsByUserID);
app.post('/getGroupsByGroupName', require("./api/group.js").getGroupsByGroupName);
app.post('/createGroup', require("./api/group.js").createGroup);



app.post('/getChannels', require("./api/channel.js").getChannelByGroupID);

app.post('/getChannelHistory', require("./api/channel.js").getChannelHistoryByChannelID);

app.post('/writeChannelHistory', require("./api/channel.js").writeChannelHistoryByChannelID);

app.post('/getUserByUserName', require("./api/user.js").getUserByUserName);
app.post('/updateUser', require("./api/user.js").updateUser);
app.post('/createUser', require("./api/user.js").createUser)