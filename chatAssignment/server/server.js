const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const server = require("./listen.js");

const PORT = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cors());



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

    // require("./api/group.js").createGroup(db,app);
    // require("./api/group.js").removeUserFromGroup(db,app);
    // require("./api/group.js").updateGroupAdmin(db,app);
    // require("./api/group.js").updateGroupAssistant(db,app);
    // require("./api/group.js").getGroupDetailsByUserID(db,app);
    // require("./api/group.js").getGroupsByGroupName(db,app);
    // require("./api/group.js").getGroupsByGroupID(db,app);

    // app.get('/getGroups', require("./api/group.js").getGroups);
    // app.post('/createGroup', require("./api/group.js").createGroup);
    // app.post("/deleteGroup", require("./api/group.js").deleteGroup);
    // app.post('/addUserToGroup', require("./api/group.js").addUserToGroup)
    // app.post("/removeUserFromGroup", require("./api/group.js").removeUserFromGroup);

    // //An API that will change the group adminID by passing in the groupID and UserID
    // app.post("/updateGroupAdmin", require("./api/group.js").updateGroupAdmin);
    // app.post("/updateGroupAssistant", require("./api/group.js").updateGroupAssistant);

    app.post('/getGroupsByUserID', require("./api/group.js").getGroupDetailsByUserID);
    // app.post('/getGroupsByGroupName', require("./api/group.js").getGroupsByGroupName);
    // app.post('/getGroupsByGroupID', require("./api/group.js").getGroupsByGroupID);

    // Channels APIs ->

    // chatHistory APIs ->

    // Users APIs ->
    require("./api/user.js").getAllUsers(db,app);
    require("./api/user.js").deleteUser(db,app);
    require("./api/user.js").getUserByUserName(db,app);
    require("./api/user.js").updateUser(db,app);
    require("./api/user.js").createUser(db,app);

    server.listen(http, PORT)
})


app.get('/getChannel', require("./api/channel.js").getChannel);
app.post("/createChannel", require("./api/channel.js").createChannel);
app.post("/deleteChannel", require("./api/channel.js").deleteChannel);
app.post("/removeUserFromChannel", require("./api/channel.js").removeUserFromChannel);
app.post("/addUserToChannel", require("./api/channel.js").addUserToChannel)
app.post("/getChannelByChannelName", require("./api/channel.js").getChannelByChannelName)
app.post('/getChannelsByUserID', require("./api/channel.js").getChannelByUserID)
app.post('/getChannelsByGroupID', require("./api/channel.js").getChannelByGroupID);


app.post('/getChannelHistory', require("./api/channel.js").getChannelHistoryByChannelID);
app.post('/writeChannelHistory', require("./api/channel.js").writeChannelHistoryByChannelID);