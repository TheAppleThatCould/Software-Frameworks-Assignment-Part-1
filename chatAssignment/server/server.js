const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const server = require("./listen.js");

const PORT = 3000;

app.use(express.urlencoded({extended: true, limit: '50mb'}));
app.use(express.json())
app.use(cors());

//Enable CORS for all HTTP methods
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// Images
const path = require('path');
const formidable = require("formidable")
app.use('/images',express.static(path.join(__dirname , './data/images')));
var fs = require('fs');


// Sockets
const sockets = require("./socket.js");
const io = require("socket.io")(http, {
    cors: {
        orgin: "http://localhost:4200",
        methods: ["GET", "POST"],
    }
});
sockets.connect(io, PORT);


//Database connection
const MongoClient = require("mongodb").MongoClient;
const mongoURL = "mongodb://localhost:27017/";

MongoClient.connect(mongoURL, function(err, client){
    if(err) throw err;

    const dbName = "ChatAssignment";
    const db = client.db(dbName);

    // Auth APIs ->
    require("./api/auth.js").login(db,app);

    // Groups APIs ->
    require("./api/group.js").getGroups(db,app);
    require("./api/group.js").addUserToGroup(db,app);
    require("./api/group.js").deleteGroup(db,app);
    require("./api/group.js").removeUserFromGroup(db,app);
    require("./api/group.js").getGroupsByUserID(db,app);
    require("./api/group.js").getGroupsByGroupName(db,app);
    require("./api/group.js").getGroupsByGroupID(db,app);
    require("./api/group.js").createGroup(db,app);
    require("./api/group.js").updateGroupAdmin(db,app);
    require("./api/group.js").updateGroupAssistant(db,app);

    // Channels APIs ->
    require("./api/channel.js").getChannel(db,app);
    require("./api/channel.js").createChannel(db,app);
    require("./api/channel.js").deleteChannel(db,app);
    require("./api/channel.js").removeUserFromChannel(db,app);
    require("./api/channel.js").addUserToChannel(db,app);
    require("./api/channel.js").getChannelByChannelName(db,app);
    require("./api/channel.js").getChannelsByUserID(db,app);
    require("./api/channel.js").getChannelsByGroupID(db,app);

    // chatHistory APIs ->
    require("./api/channel.js").getChannelHistoryByChannelID(db,app);
    require("./api/channel.js").writeChannelHistoryByChannelID(db,app);

    // Users APIs ->
    require("./api/user.js").getAllUsers(db,app);
    require("./api/user.js").deleteUser(db,app);
    require("./api/user.js").getUserByUserName(db,app);
    require("./api/user.js").updateUser(db,app);
    require("./api/user.js").createUser(db,app);
    require("./api/user.js").updateUserAvatar(db,app);

    // Images APIs ->
    require("./api/image.js").imageUpload(app,formidable,fs,path);


    server.listen(http, PORT)
})

module.exports = app; // this export is for test