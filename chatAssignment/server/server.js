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
app.post('/createGroup', require("./api/group.js").createGroup);
app.post('/addUserToGroup', require("./api/group.js").addUserToGroup)

app.post('/getGroupsByUserID', require("./api/group.js").getGroupDetailsByUserID);
app.post('/getGroupsByGroupName', require("./api/group.js").getGroupsByGroupName);
app.post('/getGroupsByGroupID', require("./api/group.js").getGroupsByGroupID);


app.post("/createChannel", require("./api/channel.js").createChannel)
app.post("/addUserToChannel", require("./api/channel.js").addUserToChannel)
app.post("/getChannelByChannelName", require("./api/channel.js").getChannelByChannelName)
app.post('/getChannelsByUserID', require("./api/channel.js").getChannelByUserID)
app.post('/getChannelsByGroupID', require("./api/channel.js").getChannelByGroupID);


app.post('/getChannelHistory', require("./api/channel.js").getChannelHistoryByChannelID);
app.post('/writeChannelHistory', require("./api/channel.js").writeChannelHistoryByChannelID);

app.get("/getAllUsers", require("./api/user.js").getAllUsers)
app.post('/getUserByUserName', require("./api/user.js").getUserByUserName);
app.post('/updateUser', require("./api/user.js").updateUser);
app.post('/createUser', require("./api/user.js").createUser)



//Need to create theses api

app.post("/deleteGroup", require("./api/group.js").deleteGroup);
app.post("/removeUserFromGroup", require("./api/group.js").removeUserFromGroup);

// app.post("/deleteChannel", require("./api/channel.js").deleteChannel);
// app.post("/deleteUser", require("./api/user.js").deleteUser);


// app.post("/removeUserFromChannel", require("./api/channel.js").removeUserFromChannel);


